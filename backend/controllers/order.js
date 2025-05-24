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

        const orders = await Order.find({user: req.user._id}).sort({ createdAt: -1})

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "You have no order!"
            });
        }

        return res.status(200).json({
            success: true,
            orders
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


export const getVendorOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const vendorOrders = await Order.find({ vendor: req.user._id }).populate("user", "name email")

    if (vendorOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for your products",
      });
    }

    return res.status(200).json({
      success: true,
      orders: vendorOrders,
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

        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1})

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: false,
                orders :[]
            });
        }

        return res.status(200).json({
            success: true,
            orders
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

