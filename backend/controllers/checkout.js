import express from "express"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import Checkout from "../models/checkout.model.js"
import { validationResult, matchedData } from "express-validator"


export const createCheckout = async(req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If there are validation errors, return the first error message
        return res.status(400).json({
            statusCode: 400,
            success: false,  
            message: errors.array()[0].msg 
        }); 
    }


    try {
        const { checkoutItems, totalPrice, shippingAddress, paymentMethod } = matchedData(req)

        if (!req.user || !req.user._id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        }

        const productIds = checkoutItems.map(item => item.productId);

        const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
        const existingIds = existingProducts.map(p => p._id.toString());
        const missingIds = productIds.filter(id => !existingIds.includes(id.toString()));
        
        if (missingIds.length > 0) {
            return res.status(400).json({   
                success: false,
                message: "Some products in your checkoutItems do not exist.",
                missingProductIds: missingIds
            });
        }

 
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,  
            totalPrice,
            paymentStatus:"pending",
            isPaid:false
        })
        return res.status(201).json({
            success: true,
            newCheckout
        });
                   
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
}







