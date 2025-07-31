import crypto from "crypto";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import dotenv from "dotenv";
import express from "express";
import Order from "../models/order.model.js";
import Checkout from "../models/checkout.model.js";
import User from "../models/user.model.js";
import Vendor from "../models/vendors.model.js";
import Transaction from "../models/transaction.model.js";
import VendorAccount from "../models/vendorAccount.model.js";
import VendorPayout from "../models/vendorPayout.model.js";
import transporter from "../utils/emailTransporter.js";
import ActivityLog from "../models/systemActivity.model.js";
import { validationResult, matchedData } from "express-validator";
import { triggerPayout } from "../utils/triggerPaystackPayout.js";

dotenv.config();

export const makePayment = async (req, res) => {
  try {
    const { email, userId, cartId, firstName, lastName, phone, address } =
      req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const verifiedTotalPrice = cart.totalPrice;
    const metadata = {
      userId,
      cartId,
      totalPrice: verifiedTotalPrice * 100,
      cartItems: cart.products,
      customer: {
        firstName,
        lastName,
        phone,
        address,
      },
    };

    const amount = verifiedTotalPrice * 100;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({        
          email,   
          amount,
          metadata,  
          callback_url:
            `${process.env.VITE_BACKEND_URL}/order-confirmation`,
        }),     
      }
    );   
    const data = await response.json();
    console.log("data", data);
    if (!data.status) {  
      throw new Error(data.message);
    }   

    res.status(200).json({
      access_code: data.data.access_code,
      reference: data.data.reference,
      authorization_url: data.data.authorization_url,
    });
    console.log("access code", data.data.access_code);
    console.log("reference code", data.data.reference);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const webHook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  try {
    const rawBody = req.body;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");
    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.log("Invalid signature");
      return res.status(401).send("Unauthorized");
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event !== "charge.success") {
      return res.status(200).send("Non-payment event received");
    }

    const data = event.data;
    const metadata = data.metadata;

    console.log("Received metadata:", metadata);

    // Step 1: Check if transaction already processed
    const existingTransaction = await Transaction.findOne({
      reference: data.reference,
    });
    if (existingTransaction) {
      console.log("Duplicate webhook call for reference:", data.reference);
      return res.status(200).send("Already processed");
    }

    // Step 2: Validate products
    const cartItems = metadata.cartItems || [];
    const productIds = cartItems.map((item) => item.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    const existingIds = existingProducts.map((p) => p._id.toString());
    const missingIds = productIds.filter((id) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing products", missingIds });
    }

    const totalPrice = parseFloat(metadata.totalPrice);
    if (isNaN(totalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Invalid totalPrice in metadata",
        received: metadata.totalPrice,
      });
    }

    // Step 3: Save Checkout
    const newCheckout = await Checkout.create({
      user: metadata.userId,
      checkoutItems: cartItems,
      shippingAddress: metadata.customer.address,
      paymentMethod: "Paystack",
      totalPrice: totalPrice,
      paymentStatus: "paid",
      isPaid: true,
      paymentDetails: data,
      paidAt: Date.now(),
    });
    console.log("New checkout", newCheckout);
    //  Step 4: Group by vendor, including variant info
    const vendorGroups = {};
    for (const item of cartItems) {
      const product = existingProducts.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) continue;

      const vendorId = product.user.toString();
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = { vendor: vendorId, items: [], total: 0 };
      }
      console.log("vendor  id", vendorId);

      vendorGroups[vendorId].items.push({
        productId: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: parseFloat(item.price),
      });

      const price = Number(item.price);
      if (isNaN(price)) {
        console.log("Invalid price:", item.price);
        continue;
      }
      console.log("price", price);

      vendorGroups[vendorId].total += price;
    }

    // Step 5: Create Orders per vendor
    const buyerFullName = `${metadata.customer.firstName} ${metadata.customer.lastName}`;
    const createdOrders = [];
    for (const vendorId in vendorGroups) {
      const vendorDoc = await Vendor.findOne({ user: vendorId });
      if (!vendorDoc) continue;

      const group = vendorGroups[vendorId];
      console.log("Group", group);
      const newOrder = await Order.create({
        user: metadata.userId,
        vendor: vendorDoc._id,
        orderItems: group.items,
        shippingAddress: newCheckout.shippingAddress,
        paymentMethod: newCheckout.paymentMethod,
        totalPrice: group.total,
        isPaid: true,
        buyerPhoneNumber: metadata.customer.phone,
        buyerName: buyerFullName,
        paidAt: newCheckout.paidAt,
        reference: data.reference,
        paymentStatus: "paid",
        paymentDetails: newCheckout.paymentDetails,
      });
      console.log("New order", newOrder);

      createdOrders.push(newOrder);
    }

    // Step 6: Finalize & clean
    newCheckout.isFinalized = true;
    newCheckout.finalizedAt = Date.now();
    await newCheckout.save();

    if (metadata.cartId) {
      await Cart.findByIdAndDelete(metadata.cartId);
    }
    console.log("Created order", createdOrders);

    // Step 7: Save transaction to prevent future duplicates
    await Transaction.create({
      reference: data.reference,
      user: metadata.userId,
      amount: data.amount / 100,
      status: "paid",
      channel: data.channel,
      currency: data.currency,
      paymentGateway: "paystack",
      paymentResponse: data,
    });

    // send mail to each vendor

    const buyerName = metadata.customer?.firstName || "A customer";
    const buyerSecondName = metadata.customer?.lastName || "";

    for (const vendorId in vendorGroups) {
      const vendorDoc = await Vendor.findOne({ user: vendorId }).populate(
        "user"
      );
      if (!vendorDoc || !vendorDoc.user?.email) continue;

      const group = vendorGroups[vendorId];

      // Create a table of products ordered
      const productListHtml = group.items
        .map(
          (item) => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">${item.name}</td>
            <td style="padding: 8px;">${item.size || "-"}</td>
            <td style="padding: 8px;">${item.color || "-"}</td>
            <td style="padding: 8px;">${item.quantity}</td>
            <td style="padding: 8px;">₦${Number(
              item.price
            ).toLocaleString()}</td>
          </tr>
        `
        )
        .join("");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: vendorDoc.user.email,
        subject: `New Order from ${buyerName} ${buyerSecondName}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #111827; padding: 20px; color: white; text-align: center;">
                  <h2>New Order Notification</h2>
                </div>
                <div style="padding: 15px;">
                  <p style="font-size: 16px;">Hello ${
                    vendorDoc.storeName || "Vendor"
                  },</p>
                  <p style="font-size: 15px;">You have received a new order from <strong>${buyerName} ${buyerSecondName} </strong>.</p>
                  <p style="font-size: 15px;">Here are the details of the products they ordered from your store:</p>

                  <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
                    <thead>
                      <tr style="background-color: #f0f0f0;">
                        <th style="padding: 8px; text-align: left;">Product</th>
                        <th style="padding: 8px; text-align: left;">Size</th>
                        <th style="padding: 8px; text-align: left;">Color</th>
                        <th style="padding: 8px; text-align: left;">Quantity</th>
                        <th style="padding: 8px; text-align: left;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productListHtml}
                    </tbody>
                  </table>

                  <p style="margin-top: 20px; font-size: 15px;">Total: <strong>₦${group.total.toLocaleString()}</strong></p>

                  <div style="margin-top: 30px; text-align: center;">
                    <a href="https://stylenest-ax2d.onrender.com/vendor/orders" style="background-color: #111827; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block;">View Order</a>
                  </div>

                  <p style="margin-top: 30px; font-size: 13px; color: #666;">Thank you for selling with StyleNest.</p>
                  <p style="font-size: 13px; color: #666;"><strong>- The StyleNest Team</strong></p>
                </div>
              </div>
            </div>
          `,
      };

      await transporter.sendMail(mailOptions);
    }

    // Step 8: Add each vendor's payoutAmount to their pendingBalance
    for (const vendorId in vendorGroups) {
      const group = vendorGroups[vendorId];

      const vendorDoc = await Vendor.findOne({ user: vendorId });
      if (!vendorDoc) {
        console.log(`Vendor not found for user ID: ${vendorId}`);
        continue;
      }

      const vendorAccount = await VendorAccount.findOne({
        vendor: vendorDoc._id,
      });
      if (!vendorAccount) {
        console.log(`VendorAccount not found for vendor ID: ${vendorDoc._id}`);
        continue;
      }

      const total = group.total || 0;
      const fee = Math.round(total * 0.03);
      const payoutAmount = total - fee;

      // Ensure no negative balances
      if (payoutAmount < 0) {
        console.log(
          `Payout amount is negative for vendor ${vendorId}, skipping.`
        );
        continue;
      }

      vendorAccount.pendingBalance = Math.max(
        0,
        vendorAccount.pendingBalance + payoutAmount
      );

      await vendorAccount.save();
    }

    return res.status(200).json({
      success: true,
      message: "Orders created per vendor successfully",
      orders: createdOrders,
    });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).send("Internal server error");
  }
};

export const verifyOrder = async (req, res) => {
  const { reference } = req.query;
  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Missing reference" });
  }

  try {
    // Check transaction first
    const transaction = await Transaction.findOne({ reference });
    if (!transaction || transaction.status !== "paid") {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found or unpaid" });
    }

    // Then confirm order creation
    const order = await Order.find({ reference: reference });
    if (!order) {
      return res.status(202).json({
        success: true,
        orderCreated: false,
        message: "Payment succeeded, but order not yet created",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Order Verify Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const accountCreation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { accountNumber, bankCode, userBankName, bankName } =
      matchedData(req);
    const loginUserId = req.user._id;

    // Confirm user exists
    const loginUser = await User.findById(loginUserId);
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    // Confirm vendor profile exists
    const vendor = await Vendor.findOne({ user: loginUserId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor does not exist.",
      });
    }

    // Prevent duplicate account
    const existingVendor = await VendorAccount.findOne({ vendor: vendor._id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already created an account.",
      });
    }

    const response = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "nuban",
        name: userBankName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ success: false, message: data.message });
    }

    const recipientCode = data.data.recipient_code;
    console.log("recipient code", recipientCode);
    // Create vendor account
    const newAccount = new VendorAccount({
      vendor: vendor._id,
      user: loginUserId,
      bankAccountNumber: accountNumber,
      bankCode,
      bankName,
      recipientCode,
      accountName: userBankName,
    });

    await newAccount.save();

    return res.status(201).json({
      success: true,
      account: newAccount,
      message: "Vendor account created.",
    });
  } catch (error) {
    console.error("Account creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const accountUpdate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: errors.array()[0].msg,
      });
    }

    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { accountNumber, bankCode, userBankName, bankName } =
      matchedData(req);

    if (!accountNumber || !bankCode || !userBankName || !bankName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const loginUserId = req.user._id;

    const vendor = await Vendor.findOne({ user: loginUserId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor  not found.",
      });
    }
    const vendorAccount = await VendorAccount.findOne({ user: loginUserId });
    if (!vendorAccount) {
      return res.status(404).json({
        success: false,
        message: "Vendor account not found.",
      });
    }
    const response = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "nuban",
        name: userBankName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ success: false, message: data.message });
    }

    const recipientCode = data.data.recipient_code;
    console.log("recipient code", recipientCode);

    vendorAccount.accountName = userBankName;
    vendorAccount.bankAccountNumber = accountNumber;
    vendorAccount.bankCode = bankCode;
    vendorAccount.recipientCode = recipientCode;
    vendorAccount.bankName = bankName;

    await vendorAccount.save();

    return res.status(200).json({
      success: true,
      account: vendorAccount,
      message: "Vendor account updated.",
    });
  } catch (error) {
    console.error("Account update error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAccountDetails = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const loginUserId = req.user._id;

    const vendorAccount = await VendorAccount.findOne({ user: loginUserId })
      .populate("vendor", "storeName storeLogo")
      .populate("user", "name email");

    if (!vendorAccount) {
      return res.status(404).json({
        success: false,
        message: "Vendor account not found.",
      });
    }

    const totalPayoutHistory = await VendorPayout.countDocuments({
      vendor: vendorAccount.vendor,
      status: "success",
    });

    return res.status(200).json({
      success: true,
      account: vendorAccount,
      totalPayoutHistory,
    });
  } catch (error) {
    console.error("Get account error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const markAsDelivered = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const loginUserId = req.user._id;
    const { orderId } = req.params;

    const user = await User.findOne({ _id: loginUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, Please log in ",
      });
    }

    const vendor = await Vendor.findOne({ user: loginUserId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const order = await Order.findOne({ _id: orderId, vendor: vendor._id })
      .populate("user")
      .populate("vendor");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found, please log in to your account.",
      });
    }

    if (
      order.isDelivered ||
      order.deliveredAt ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order has already been marked as delivered.",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = "delivered";

    await order.save();

    // Send email to buyer
    const buyer = order.user;
    const buyerName = buyer.name?.split(" ")[0] || "there";
    const VendorName = order.vendor.storeName;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: buyer.email,
      subject: `Your order has been delivered - please confirm`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="background-color: #111827; padding: 20px; color: white; text-align: center;">
              <h2>Delivery Confirmation Needed</h2>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Hi ${buyerName},</p>
              <p style="font-size: 15px;">
                ${VendorName || "The vendor"} has marked your order <strong>#${
        order._id
      }</strong> as delivered.
              </p>
              <p style="font-size: 15px;">
                If you've received your items, please take a moment to confirm by clicking the button below.
              </p>

              <div style="margin-top: 30px; text-align: center;">
                <a href="https://stylenest-ax2d.onrender.com/order/${
                  order._id
                }" 
                   style="background-color: #111827; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block;">
                   Confirm Delivery
                </a>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #555;">
                Confirming helps us ensure fast payouts to vendors and improves the shopping experience for everyone.
              </p>

              <p style="margin-top: 20px; font-size: 13px; color: #888;">
                Thank you for shopping with <strong>StyleNest</strong>.<br/>
                — The StyleNest Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Trigger payout only if buyer has already confirmed receipt
    if (order.isReceived && order.receivedAt) {
      await triggerPayout(order);
    }

    return res
      .status(200)
      .json({ success: true, message: "Order marked as delivered." });
  } catch (error) {
    console.error("Mark as delivered error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const markAsReceived = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, Please log in ",
      });
    }
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found, Please log in to your account",
      });
    }

    if (order.isReceived || order.receivedAt) {
      return res.status(404).json({
        success: false,
        message: "Order has already been mark as received",
      });
    }

    if (order.isCanceled) {
      return res.status(404).json({
        success: false,
        message: "This order was cancelled and cannot be marked as received.",
      });
    }

    order.isReceived = true;
    order.receivedAt = new Date();
    order.cancelRequested = false;
    order.cancelReason = "";

    await order.save();

    // Check if vendor already delivered
    if (
      order.isDelivered &&
      order.deliveredAt &&
      order.status === "delivered"
    ) {
      await triggerPayout(order);
    }

    await ActivityLog.create({
      user: userId,
      userRole: "customer",
      actionType: "order_received",
      description: `Buyer ${user?.name} confirmed receipt of order #${order._id} (Total: ₦${order.totalPrice}).`,
      status: "success",
    });

    return res
      .status(200)
      .json({ success: true, message: "Order marked as received" });
  } catch (error) {
    console.error("Mark as received error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getListOfBanks = async (req, res) => {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }
  try {
    const response = await fetch(
      "https://api.paystack.co/bank?country=nigeria",
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to fetch banks",
      });
    }

    return res.status(200).json({
      success: true,
      banks: data.data,
    });
  } catch (error) {
    console.error("Get list of banks error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resolveName = async (req, res) => {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const { accountNumber, bankCode } = req.query;

  try {
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ success: false, message: data.message });
    }

    return res.json({
      success: true,
      accountName: data.data.account_name,
    });
  } catch (err) {
    console.error("Resolve error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const payoutHistory = async (req, res) => {
  if (!req.user || req.user.role !== "vendor" || !req.user._id) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const loginUser = req.user._id;
    const vendor = await Vendor.findOne({ user: loginUser });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const totalPayoutHistory = await VendorPayout.countDocuments({
      vendor: vendor._id,
      status: "success",
    });

    const vendorPayoutHistory = await VendorPayout.find({
      vendor: vendor._id,
      status: "success",
    })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasNextPage = page * limit < totalPayoutHistory;
    console.log(totalPayoutHistory);
    return res.status(200).json({
      success: true,
      vendorPayoutHistory,
      hasNextPage,
      totalPayoutHistory,
    });
  } catch (err) {
    console.error("Resolve error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
