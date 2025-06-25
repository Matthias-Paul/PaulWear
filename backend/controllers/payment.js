import crypto from 'crypto';
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"
import dotenv from "dotenv";
import express from 'express';
import Order from '../models/order.model.js';
import Checkout from '../models/checkout.model.js';
import User from '../models/user.model.js';


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
      const rawBody = req.body; // raw buffer
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
      const signature = req.headers["x-paystack-signature"];
  
      if (hash !== signature) {
        console.log("Invalid signature");
        return res.status(401).send("Unauthorized request");
      }
  
      const event = JSON.parse(rawBody.toString());
  
      if (event.event === "charge.success") {
        const data = event.data;
        const metadata = data.metadata;
        console.log("Metadata received:", metadata);
  
        // 1. Validate products
        const productIds = metadata.cartItems.map(item => item.productId);
        const existingProducts = await Product.find({ _id: { $in: productIds } });
        const existingIds = existingProducts.map(p => p._id.toString());
        const missingIds = productIds.filter(id => !existingIds.includes(id.toString()));
  
        if (missingIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Some products in your cart do not exist.",
            missingProductIds: missingIds
          });
        }
  
        // 2. Create Checkout
        const newCheckout = await Checkout.create({
          user: metadata.userId,
          checkoutItems: metadata.cartItems,
          shippingAddress: metadata.customer.address,
          paymentMethod: "Paystack",
          totalPrice: metadata.totalPrice,
          paymentStatus: "paid",
          isPaid: true,
          paymentDetails: data,
          paidAt: Date.now(),
        });
  
        // 3. Group items by vendor
        const vendorGroups = {};
        for (const item of newCheckout.checkoutItems) {
          const product = existingProducts.find(p => p._id.toString() === item.productId);
          if (!product) continue;
  
          const vendorId = product.user.toString();
          if (!vendorGroups[vendorId]) {
            vendorGroups[vendorId] = {
              vendor: vendorId,
              items: [],
              total: 0,
            };
          }
  
          const itemTotal = item.price * item.quantity;
          vendorGroups[vendorId].items.push({
            productId: product._id,
            name: product.name,
            image: product.images[0]?.url || "",
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          });
          vendorGroups[vendorId].total += itemTotal;
        }
  
        // 4. Create Orders per vendor
        const createdOrders = [];
  
        for (const vendorId in vendorGroups) {
          const group = vendorGroups[vendorId];
  
          const newOrder = await Order.create({
            user: newCheckout.user,
            vendor: group.vendor,
            orderItems: group.items,
            shippingAddress: newCheckout.shippingAddress,
            paymentMethod: newCheckout.paymentMethod,
            totalPrice: group.total,
            isPaid: true,
            paidAt: newCheckout.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: newCheckout.paymentDetails,
          });
  
          createdOrders.push(newOrder);
        }
  
        // 5. Finalize checkout and cleanup
        newCheckout.isFinalized = true;
        newCheckout.finalizedAt = Date.now();
        await newCheckout.save();
        await Checkout.findByIdAndDelete(newCheckout._id);
  
        if (metadata.cartId) {
          await Cart.findByIdAndDelete(metadata.cartId);
        }
  
        return res.status(200).json({
          success: true,
          message: "Orders created per vendor",
          orders: createdOrders,
        });
      }
  
      return res.status(200).send("Webhook received (non-charge.success event)");
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(500).send("Internal server error");
    }
  };
  