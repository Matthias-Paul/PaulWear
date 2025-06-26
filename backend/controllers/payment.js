import crypto from 'crypto';
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"
import dotenv from "dotenv";
import express from 'express';
import Order from '../models/order.model.js';
import Checkout from '../models/checkout.model.js';
import User from '../models/user.model.js';
import Vendor from '../models/vendors.model.js';
import Transaction from '../models/transaction.model.js';


dotenv.config();


export const makePayment = async (req, res)=>{


    try {

        const {
            email,
            amount,
            userId,
            cartId,
            myCart,
            firstName,
            lastName,
            phone,
            address,
            totalPrice,
          } = req.body;
      
          const metadata = {
            userId,
            cartId,
            totalPrice,
            cartItems: myCart,
            customer: {
              firstName,
              lastName,
              phone,
              address
            },
          };
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount, metadata}),
    });  
            const  data  = await response.json();
            console.log("data", data)
            if (!data.status) {
                throw new Error(data.message);
              }

            res.status(200).json({
                access_code: data.data.access_code,
                reference: data.data.reference,
            });  
            console.log("access code", data.data.access_code)
            console.log("reference code", data.data.reference)

        } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}  

    




export const webHook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  try {
    const rawBody = req.body;
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
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

    // ✅ Step 1: Check if transaction already processed
    const existingTransaction = await Transaction.findOne({ reference: data.reference });
    if (existingTransaction) {
      console.log("Duplicate webhook call for reference:", data.reference);
      return res.status(200).send("Already processed");
    }

    // ✅ Step 2: Validate products
    const cartItems = metadata.cartItems || [];
    const productIds = cartItems.map(item => item.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    const existingIds = existingProducts.map(p => p._id.toString());
    const missingIds = productIds.filter(id => !existingIds.includes(id));
    if (missingIds.length > 0) {
      return res.status(400).json({ success: false, message: "Missing products", missingIds });
    }

    const totalPrice = parseFloat(metadata.totalPrice);
      if (isNaN(totalPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid totalPrice in metadata",
          received: metadata.totalPrice
        });
      }
    // ✅ Step 3: Save Checkout
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
    console.log("New checkout", newCheckout)
    // ✅ Step 4: Group by vendor, including variant info
    const vendorGroups = {};
    for (const item of cartItems) {
      const product = existingProducts.find(p => p._id.toString() === item.productId);
      if (!product) continue;

      const vendorId = product.user.toString();
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = { vendor: vendorId, items: [], total: 0 };
      }
      console.log("vendor  id", vendorId)

      vendorGroups[vendorId].items.push({
        productId: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        total = parseFloat(group.total);
      });

      const price = Number(item.price);
      if (isNaN(price)) {
        console.log("Invalid price:", item.price);
        continue;
      }

      vendorGroups[vendorId].total += price;
    }

    // ✅ Step 5: Create Orders per vendor
    const createdOrders = [];
    for (const vendorId in vendorGroups) {
      const vendorDoc = await Vendor.findOne({ user: vendorId });
      if (!vendorDoc) continue;

      const group = vendorGroups[vendorId];
        console.log("Group", group)
      const newOrder = await Order.create({
        user: metadata.userId,
        vendor: vendorDoc._id,
        orderItems: group.items,
        shippingAddress: newCheckout.shippingAddress,
        paymentMethod: newCheckout.paymentMethod,
        totalPrice: group.total,
        isPaid: true,
        paidAt: newCheckout.paidAt,
        reference: data.reference,
        paymentStatus: "paid",
        paymentDetails: newCheckout.paymentDetails,
      });
      console.log("New order", newOrder)

      createdOrders.push(newOrder);
    }

    // ✅ Step 6: Finalize & clean
    newCheckout.isFinalized = true;
    newCheckout.finalizedAt = Date.now();
    await newCheckout.save();

    if (metadata.cartId) {
      await Cart.findByIdAndDelete(metadata.cartId);
    }
    console.log("Created order", createdOrders)


    // ✅ Step 7: Save transaction to prevent future duplicates
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