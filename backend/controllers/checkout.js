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
        console.log(checkoutItems)         
   
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

export const payCheckout = async (req, res) => {

    try {
        const { paymentStatus, paymentDetails } = req.body;

        if (!paymentStatus || !paymentDetails) {
            return res.status(400).json({
                success: false,
                message: "Payment status and payment details are required.",
            });       
        }

        if (paymentStatus !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status. Only 'paid' is accepted.",
            });
        }
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found.",
            });
        }
        // Prevent paying again
        if (checkout.isPaid) {
            return res.status(400).json({
                success: false,
                message: "This checkout has already been paid.",
            });
        }
   
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();

        await checkout.save();

        return res.status(200).json({
            success: true,
            checkout,
            message: "Checkout payment successful.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const finalizeCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found.",
      });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({
        success: false,
        message: "Checkout already finalized.",
      });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Checkout is not paid.",
      });
    }

    let checkoutTotal = 0; // New: Total for all items
    const createdOrders = [];

    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId); 

      if (!product) {
        console.log(`Product not found for item: ${item}`);
        continue;
      }

      const itemTotal = item.price * item.quantity; // Individual item total
      checkoutTotal += itemTotal; // Add to checkout total

      const newOrder = await Order.create({
        user: checkout.user,
        vendor: product.user,
        orderItems: [
          {
            productId: product._id,
            name: product.name,
            image: product.images[0]?.url || "",
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          }
        ],
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: itemTotal, // Per order total (single item in this case)
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      createdOrders.push(newOrder);
    }

    // Mark checkout as finalized and store the total (optional: you can add checkoutTotal field in Checkout schema if needed)
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    checkout.totalPrice = checkoutTotal; // Optional: Save this in checkout if schema has it
    await checkout.save();

    // Delete the checkout after finalizing
    await Checkout.findByIdAndDelete(checkout._id);

    return res.status(201).json({
      success: true,
      message: "Orders finalized from checkout successfully.",
      totalAmount: checkoutTotal, // Total for the entire checkout
      orders: createdOrders,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
