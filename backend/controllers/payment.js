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
      const rawBody = req.body; // This is already a buffer due to `bodyParser.raw`
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
      const signature = req.headers["x-paystack-signature"];
  
      if (hash !== signature) {
        console.log("Invalid signature");
        return res.status(401).send("Unauthorized request");
      }
  
      const event = JSON.parse(rawBody.toString()); // Convert Buffer to JSON
  
      if (event.event === "charge.success") {
        const data = event.data;
        const metadata = data.metadata;
  
        console.log("Metadata received:", metadata);
        
        // 1. Validate products exist
      const productIds = metadata.cartItems.map(item => item.productId);
      const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
      const existingIds = existingProducts.map(p => p._id.toString());
      const missingIds = productIds.filter(id => !existingIds.includes(id.toString()));

      if (missingIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some products in your cart do not exist.",
          missingProductIds: missingIds
        });
      }

      // 2. Create new checkout
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

      // 3. Finalize into orders
      let checkoutTotal = 0;
      const createdOrders = [];

      for (const item of newCheckout.checkoutItems) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        const itemTotal = item.price 
        checkoutTotal += itemTotal;

        const newOrder = await Order.create({
          user: newCheckout.user,
          vendor: product.user,
          orderItems: [{
            productId: product._id,
            name: product.name,
            image: product.images[0]?.url || "",
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          }],
          shippingAddress: newCheckout.shippingAddress,
          paymentMethod: newCheckout.paymentMethod,
          totalPrice: itemTotal,
          isPaid: true,
          paidAt: newCheckout.paidAt,
          isDelivered: false,
          paymentStatus: "paid",
          paymentDetails: newCheckout.paymentDetails,
        });

        createdOrders.push(newOrder);
      }

      // 4. Finalize and delete checkout
      newCheckout.isFinalized = true;
      newCheckout.finalizedAt = Date.now();
      newCheckout.totalPrice = checkoutTotal;
      await newCheckout.save();

      await Checkout.findByIdAndDelete(newCheckout._id);

      if (metadata.cartId) {
        await Cart.findByIdAndDelete(metadata.cartId);
      }

      return res.status(200).json({
        success: true,
        message: "Webhook order finalized",
        totalAmount: checkoutTotal,
        orders: createdOrders
      });
    }
    console.log("orders", orders)
    
      
      return res.status(200).send("Webhook received (non-success event)");
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(500).send("Internal server error");
    }
  };


