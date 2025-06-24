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






export const webHook = async (req, res)=>{

    const secret = process.env.PAYSTACK_SECRET_KEY;
    console.log("Secret", secret)
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    console.log("Hash", hash)

    console.log( "headers", req.headers['x-paystack-signature'])
    
    if (hash == req.headers['x-paystack-signature']) {
           
                
        const event = JSON.parse(req.body.toString());
     
        console.log("Event", event)
        if (event.event === 'charge.success') {
            const data = event.data;
            const metadata = data.metadata;
            console.log("metadata", metadata)
            console.log("data", data)
      
            try {
              // await Order.create({
              //   user: metadata.userId,
              //   checkoutId: metadata.checkoutId,
              //   products: metadata.cartItems,
              //   customer: metadata.customer,
              //   amountPaid: data.amount / 100,
              //   status: 'Paid',
              //   reference: data.reference,
              //   channel: data.channel,
              //   paidAt: data.paid_at,
              //   paymentGateway: 'paystack',
              // });
              return res.status(200).send('Order saved');
            } catch (err) {   
              console.error('Error saving order:', err);
              return res.status(500).send('DB Error');
            }      
          }
        
    }    
    return res.sendStatus(200); // Return 200
}



