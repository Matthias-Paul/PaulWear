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

    // Get all orders for the logged-in vendor's products
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const vendorProducts = await Product.find({ user: req.user._id }, "_id");
    const vendorProductIds = vendorProducts.map(p => p._id);
    const vendorProductIdSet = new Set(vendorProductIds.map(id => id.toString()));

    const allOrders = await Order.find({   
      "orderItems.productId": { $in: vendorProductIds },
    })                                                                                                                                                          
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("orderItems.productId");
     
    const filteredOrders = allOrders.map(order => {
      const vendorItems = order.orderItems
        .filter(item => {
          return (
            item.productId && vendorProductIdSet.has(item.productId._id.toString())
          );
        })
        .map(item => ({
          productId: item.productId._id,   
          name: item.productId.name,
          image: item.productId.image,
          price: item.productId.price,        
          quantity: item.quantity,          
        }));
         
      return {    
        _id: order._id,
        user: order.user,
        shippingAddress: order.shippingAddress,
        totalPrice: order.totalPrice,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        orderItems: vendorItems,
      };
    });

    const vendorOrders = filteredOrders.filter(order => order.orderItems.length > 0);

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
;


