import crypto from 'crypto';
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"
import dotenv from "dotenv";
import express from 'express';
import Order from '../models/order.model.js';
import Checkout from '../models/checkout.model.js';


dotenv.config();


export const makePayment = async (req, res)=>{


    try {

        const {
            email,
            amount,
            userId,
            checkoutId,
            myCart,
            firstName,
            lastName,
            phone,
          } = req.body;
      
          const metadata = {
            userId,
            checkoutId,
            cartItems: myCart,
            customer: {
              firstName,
              lastName,
              phone,
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
      // Get raw body buffer
      const rawBody = req.body; // This is already a buffer due to `bodyParser.raw`
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
      const signature = req.headers["x-paystack-signature"];
  
      // Log hash & signature
      console.log("Local Hash:", hash);
      console.log("Header Signature:", signature);
  
      if (hash !== signature) {
        console.log("❌ Invalid signature");
        return res.status(401).send("Unauthorized request");
      }
  
      const event = JSON.parse(rawBody.toString()); // Convert Buffer to JSON
      console.log("✅ Verified Event:", event);
  
      if (event.event === "charge.success") {
        const data = event.data;
        const metadata = data.metadata;
  
        console.log("✅ Metadata received:", metadata);
  
        // Optional: Save to DB
        // await Order.create({ ... });
  
        return res.status(200).send("Webhook received & verified");
      }
      
      return res.status(200).send("Webhook received (non-success event)");
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(500).send("Internal server error");
    }
  };


