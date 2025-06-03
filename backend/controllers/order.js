import express from "express"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import { validationResult, matchedData } from "express-validator"


export const getOrders = async( req, res)=>{

    try {

        if (!req.user || !req.user._id ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }          
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
   
        const orders = await Order.find({user: req.user._id}).sort({ createdAt: -1}).skip(skip).limit(limit)
        
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                orders:[],    
                message: "You have no order!"
            });
        }              
      
        const totalOrders = await Order.countDocuments({ user: req.user._id });
        console.log(totalOrders)
        const hasNextPage = page * limit < totalOrders

        return res.status(200).json({
            success: true,
            orders,
            hasNextPage
        });


    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}



export const  getOrderDetails = async(req, res)=>{

    try {
       
        const { id } = req.params
        const orderDetails = await Order.findById(id).populate(
            "user",
            "name email"
        )
        if (!orderDetails ) {
            return res.status(404).json({
                success: false,
                message: "Order not found!"
            });
        }
        return res.status(200).json({
          success: true,  
          orderDetails,
        });
  
    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}

export const updateOrderIsReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { markAsReceived } = req.body;

    if (markAsReceived !== true) {
      return res.status(400).json({
        success: false,
        message: "markAsReceived field is required and must be true.",
      });
    }

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    const orderDetails = await Order.findById(id).populate("user", "name email");

    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    if (orderDetails.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this order!",
      });
    }

    if (orderDetails.isReceived === true) {
      return res.status(400).json({
        success: false,
        message: "You have already marked this order as received.",
      });
    }

    orderDetails.isReceived = true;
    orderDetails.receivedAt = new Date();

    await orderDetails.save(); 

    return res.status(200).json({
      success: true,
      message: "Order marked as received successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getVendorOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

    const vendorOrders = await Order.find({ vendor: req.user._id }).populate("user", "name email").sort({ createdAt: -1}).skip(skip).limit(limit)

    if (vendorOrders.length === 0) {
      return res.status(200).json({
        success: true,
        orders:[],
        message: "No orders found for your products",
      });
    }

    const totalOrders = await Order.countDocuments({ vendor: req.user._id });
        console.log(totalOrders)
        const hasNextPage = page * limit < totalOrders

    return res.status(200).json({
      success: true,
      orders: vendorOrders,
      hasNextPage
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAllOrders = async( req, res)=>{

    try {

        if (!req.user || req.user.role !== "admin" ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }     

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1}).skip(skip).limit(limit)

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: false,
                orders :[]
            });
        }

         const totalOrders = await Order.countDocuments();
        console.log(totalOrders)
        const hasNextPage = page * limit < totalOrders

        return res.status(200).json({
            success: true,
            orders,
            hasNextPage
        });


    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}


export const editVendorOrders = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { orderId, status } = matchedData(req);

    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this order.",
      });
    }

    const updateOrder = await Order.findById(orderId);
    if (!updateOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (updateOrder.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this order.",
      });
    }

    if (status) {
      updateOrder.status = status;

      if (status.toLowerCase() === "delivered") {
        updateOrder.isDelivered = true;
        updateOrder.deliveredAt = Date.now()
      }else {
        updateOrder.isDelivered = false;
        updateOrder.deliveredAt = null;
      }
    }   

    await updateOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order: updateOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

