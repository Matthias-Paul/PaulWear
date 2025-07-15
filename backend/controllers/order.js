import express from "express"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Vendor from "../models/vendors.model.js"
import transporter from "../utils/emailTransporter.js";


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
       
       
export const requestCancelOrder = async (req, res) => {

  if (!req.user || !req.user._id  ) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized access",
    });
    }     


 
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(404).json({ success: false, message: "Order ID is required. " });
    }

    const { cancelReason } = req.body
    if (!cancelReason) {
      return res.status(404).json({ success: false, message: "Reason for cancellation is required. " });
    }
    const order = await Order.findOne({_id: orderId, user: userId});

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (order.isReceived) {
      return res.status(400).json({ success: false, message: "You cannot cancel an order after marking it as received." });
    }

    if (order.cancelRequested) {
      return res.status(400).json({ success: false, message: "You have already requested for cancellation please be patient while the team review your submission." });
    }

    if (order.isCanceled) {
      return res.status(400).json({ success: false, message: "Order already canceled." });
    }

    order.cancelRequested = true;
    order.cancelReason = cancelReason || "No reason provided";

    await order.save();
    
    const email = "pauladesina117@gmail.com"
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "A buyer canceled an order",
         html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
      
      <div style="background-color: #1f2937; padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; font-size: 22px; margin: 0;">Order Cancellation Request</h2>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">
          Hello Admin,
        </p>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
          A buyer, <strong>${order.buyerName}</strong>, has submitted a request to cancel their order.
        </p>

        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
          <strong>Order ID:</strong> ${order._id}<br/>
          <strong>Reason:</strong> ${cancelReason}
        </p>

        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
          Kindly review this request from the admin dashboard and take appropriate action after contacting the buyer and vendor for confirmation.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          Thank you,<br/>
          <strong>StyleNest Support Team</strong>
        </p>
      </div>

      <div style="background-color: #f9fafb; text-align: center; padding: 16px; font-size: 12px; color: #9ca3af;">
        &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
      </div>
    </div>
  </div>
`,


      };   

      // Send email
      await transporter.sendMail(mailOptions);


      return res.status(200).json({
        success: true,
        message: "Your cancellation request has been received. Our team will review it and get back to you shortly via email.",
      });
        
  
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
   
 
       
       
