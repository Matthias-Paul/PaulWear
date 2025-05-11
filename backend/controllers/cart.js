import express from "express"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"

import { validationResult, matchedData } from "express-validator"

const getCart =async(userId, guestId)=>{
    if(userId){
        return await cart.findOne({ user: userId})
    }else if (guestId){
        return await cart.findOne({ guestId })
    }
    return null;
}


export const addCart = async(req, res, next)=>{  
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
         const { productId, size, color, quantity, guestId, userId } = matchedData(req)     
   
         const product = await Product.findById(productId)

         if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });
        }


        let cart = await getCart(userId, guestId)
        
        if(cart){
            const productIndex = cart.products.findIndex((p)=> p.productIndex.toString()  === productId && p.size === size && p.color === color  )   
        
            if(productIndex > -1){
                cart.products[productIndex].quantity += quantity;

            }else{
                cart.products.push({
                    productId,
                    name: product.name,
                    
                })
            }

        
        }

        

    } catch (error) {
         return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}