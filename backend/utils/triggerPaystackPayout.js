import VendorAccount from "../models/vendorAccount.model.js";
import VendorPayout from "../models/vendorPayout.model.js";
import { transferToVendor } from "./paystackTransfer.js";
import ActivityLog from "../models/systemActivity.model.js";

export const triggerPayout = async (order) => {
  if (
    !order.isDelivered ||
    !order.deliveredAt ||
    !order.isReceived ||
    !order.receivedAt ||
    order.status !== "delivered" ||
    order.isPayoutSuccess === true ||
    order?.isCanceled
  ) {
    return;
  }

  const vendorAccount = await VendorAccount.findOne({ vendor: order.vendor });
  if (!vendorAccount || !vendorAccount.recipientCode) {
    console.error("Vendor payout info missing");
    return;
  }

  const total = order.totalPrice;
  const fee = Math.round(total * 0.03);
  const payoutAmount = total - fee;

  const result = await transferToVendor({
    amount: payoutAmount,
    recipient: vendorAccount.recipientCode,
    reason: `Order payout for order ${order._id}`,
  });
  console.log("vendor recipient code", vendorAccount.recipientCode);
  console.log("result", result);

  if (result.status !== "success") {
    await ActivityLog.create({
      user: vendorAccount.user,
      userRole: "vendor",
      actionType: "payout_failed",
      description: `Failed payout attempt of ₦${amount} to vendor ${vendorAccount.user}. Error: ${result.reason}`,
      status: "failure",
    });
  }

  await VendorPayout.create({
    vendor: order.vendor,
    user: order.user,
    order: order._id,
    transaction: order.reference,
    payoutAmount,
    feeDeducted: fee,
    transferReference: result.reference,
    status: result.status === "success" ? "success" : "failed",
    reason: result.message,
    completedAt: result.status === "success" ? new Date() : null,
  });

  order.isPayoutSuccess = result.status === "success";
  order.isPayoutDate = new Date();
  await order.save();

  await ActivityLog.create({
    user: vendorAccount.user,
    userRole: "vendor",
    actionType: "payout_successful",
    description: `Payout of ₦${payoutAmount} successfully made to  vendor  (Vendor ID: ${vendorAccount.vendor}).`,
    status: "success",
  });

  if (result.status === "success") {
    vendorAccount.pendingBalance -= payoutAmount;
    vendorAccount.totalBalance += payoutAmount;
    await vendorAccount.save();
  }
};
