import express from "express"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Vendor from "../models/vendors.model.js"

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
   
        const orders = await Order.find({user: req?.user?._id}).populate("vendor", "email storeName contactNumber").sort({ createdAt: -1}).skip(skip).limit(limit)
        
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                orders:[],    
                message: "You have no order!"
            });
        }              
      
        const totalOrders = await Order.countDocuments({ user: req?.user?._id });
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
        const orderDetails = await Order.findById(id).populate([
          { path: "user", select: "name email" },
          { path: "vendor", select: " email storeName contactNumber " },
        ]);        
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

       

        const search = req.query.search
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const vendor = await Vendor.findOne({ user: req.user._id  })
        if (!vendor) {
          return res.status(404).json({
            success: false,  
            message: "Vendor  not found.",
          });
          }

          let filter = {
            $and: [{ vendor: vendor._id }],
          };    
          
          if (search) {
            filter.$and.push({
              $or: [
                { buyerName: { $regex: search, $options: "i" } },
                { buyerPhoneNumber: { $regex: search, $options: "i" } },
              ],
            });
          }
            

    const vendorOrders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1}).skip(skip).limit(limit)

    if (vendorOrders.length === 0) {
      return res.status(200).json({
        success: true,
        orders:[],
        message: "No orders found for your products",
      });
    }
        
    const totalOrders = await Order.countDocuments(filter);
        console.log(totalOrders)
        const hasNextPage = page * limit < totalOrders
        console.log(hasNextPage)
  
    return res.status(200).json({
      success: true,
      orders: vendorOrders,
      hasNextPage,
      totalOrders,
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


