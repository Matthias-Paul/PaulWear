import express from "express"
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js"

import { validationResult, matchedData } from "express-validator"

const getCart =async(userId, guestId)=>{
    if(userId){    
        return await Cart.findOne({ user: userId})
    }else if (guestId){
        return await Cart.findOne({ guestId })
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
   
         console.log("ProductID:", productId,"UserID:", userId, "guestID:", guestId)
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found!",
                });
            }

            let cart = await getCart(userId, guestId);
                  
    
            if (cart) {
                const productIndex = cart.products.findIndex(
                    (p) => p.productId.toString() === productId && p.size === size && p.color === color
                );
                console.log("productIndex", productIndex)
      
                if (productIndex > -1) {
                    cart.products[productIndex].quantity += quantity;
                    cart.products[productIndex].price = Number(product.price) * cart.products[productIndex].quantity;
                } else {                
                    cart.products.push({        
                        productId,    
                        name: product.name,
                        image: product.images?.[0]?.url ?? null,
                        price: product.price * quantity,   
                        size,    
                        color,           
                        quantity
                    });   
                }          
                cart.totalPrice = cart.products.reduce((acc, item) => acc + Number(item.price), 0); 
                 await cart.save();
      
                return res.status(200).json({
                    success: true,
                    message: "Product added ",
                    cart
                });    
    
            } else {
                const newCart = await Cart.create({  
                    user: userId ?? undefined,     
                    guestId: userId ? undefined : (guestId || `guest_${Date.now()}`),
                    products: [       
                        {                   
                            productId,
                            name: product.name,
                            image: product.images?.[0]?.url ?? null,
                            price: product.price * quantity,
                            size,   
                            color,
                            quantity
                        }
                    ],
                    totalPrice: product.price * quantity
                });

                return res.status(201).json({
                    success: true,
                    message: "Product added ",
                    cart: newCart
                });
            }

     
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
} 

export const editCart = async(req, res, next)=>{
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

         const product = await Product.findById(productId);
            if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
            }

         let cart = await getCart(userId, guestId)
         if(!cart){
            return res.status(404).json({
                success: false,
                message:"Cart not found"
            })
         }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId && p.size === size && p.color === color
        );

        if(productIndex > -1){
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity;
                cart.products[productIndex].price = Number(product.price) * cart.products[productIndex].quantity;

            }else{
                cart.products.splice(productIndex, 1)
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + Number(item.price), 0); 
            await cart.save()

            return res.status(200).json({
                success: true,
                cart,
                message:"Product updated"
            })
        }else{
            return res.status(404).json({
                success: false,
                message:"Product not found"
            })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}


export const deleteCart = async(req, res, next)=>{

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

         console.log("productId:", productId)
                    
         let cart = await getCart(userId, guestId)
         if(!cart){
            return res.status(404).json({
                success: false,
                message:"Cart not found"
            })
         }


        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId && p.size === size && p.color === color
        );   
          
        if(productIndex > -1){
            cart.products.splice(productIndex, 1 )
            cart.totalPrice = cart.products.reduce((acc, item) => acc + Number(item.price), 0); 
            await cart.save()

            return res.status(200).json({
                success: true,
                message:"Product removed from the cart"
            })    
                                   
        }else{                             
            return res.status(404).json({
                success: false,
                message:"Product not found in the cart"
            })
        }    
   

        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}
      
           

export const getUserCart = async(req, res, next)=>{

        

    try {      

        const { guestId, userId } = req.query
        console.log("guestId:", guestId, "UserId:", userId)

        if (!guestId && !userId) {
            return res.status(400).json({
                success: false,   
                message: "Either guestId or userId must be provided",
            });
        }       
        const cart = await getCart(userId, guestId )
        
        if(!cart){                 
            return res.status(404).json({
                success: false,
                message:"Cart not found"
            })                  
         }        
     
        return res.status(200).json({
                success: true,
                cart                
        })     

    } catch (error) {
        console.log(error.message)   
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }

}

export const mergeUserCart = async (req, res) => {
    try {
        const { guestId } = req.body;

        if (!guestId) {
            return res.status(400).json({
                success: false,
                message: "GuestId must be provided",
            });
        }

        const guestCart = await Cart.findOne({ guestId });

        if (!guestCart || guestCart.products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guest cart not found or empty.",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        }

        let userCart = await Cart.findOne({ user: req.user._id });
     
        if (!userCart) {
            // Re-assign the guest cart to the user, if user doesn't have a cart yet
            guestCart.user = req.user._id;
            guestCart.guestId = null;
            await guestCart.save();
      
            return res.status(200).json({
                success: true,
                cart: guestCart,
                message: "Guest cart assigned to user.",
            });
        }

        // Merge logic
       for (const guestItem of guestCart.products) {
        const existingIndex = userCart.products.findIndex(item =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );                    

    if (existingIndex > -1) {
        const currentItem = userCart.products[existingIndex];
        
        const unitPrice = currentItem.price / currentItem.quantity;

        currentItem.quantity += guestItem.quantity;

        currentItem.price = unitPrice * currentItem.quantity;
    } else {
        userCart.products.push(guestItem);
    }
}

    
        // Recalculate total price
        userCart.totalPrice = userCart.products.reduce((acc, item) => acc + Number(item.price), 0); 
        await userCart.save();

        // Delete the guest cart
        try {
            await Cart.findOneAndDelete({ guestId });
        } catch (error) {
            console.error("Error deleting guest cart:", error.message);
        }

        return res.status(200).json({
            success: true,
            cart: userCart,
            message: "Carts merged successfully.",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


