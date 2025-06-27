import VendorAccount from "../models/vendorAccount.model.js";
import VendorPayout from "../models/vendorPayout.model.js";
import { transferToVendor } from "./paystackTransfer.js";

export const triggerPayout = async (order) => {
  if (
    !order.isDelivered || !order.deliveredAt ||
    !order.isReceived || !order.receivedAt ||
    order.status !== "delivered"
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
  console.log("Fee", fee)
  console.log("payoutAmount", payoutAmount)

  // Send transfer
  const result = await transferToVendor({
    amount: payoutAmount,
    recipient: vendorAccount.recipientCode,
    reason: `Order payout for order ${order._id}`
  });

  // Log payout
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
    completedAt: result.status === "success" ? new Date() : null
  });

  // Optional: update balance
  vendorAccount.pendingBalance -= payoutAmount;
  await vendorAccount.save();
};
