import express from "express"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import Order from "../models/order.model.js"
import Vendor from "../models/vendors.model.js"
import ProductReview from "../models/review.model.js"
import mongoose from "mongoose";

import { validationResult, matchedData } from "express-validator"








export const updateVendorRating = async (vendorId) => {
  try {
    // Get all product IDs that belong to this vendor
    const vendorProducts = await Product.find({ user: vendorId }).select("_id");

    const productIds = vendorProducts.map((p) => p._id);
    
    const vendorMainId = await Vendor.findOne({user:vendorId })
    if (!vendorMainId) {
      return res.status(200).json({
        success: true,
        message: "Vendor Profile not found",
      });
    }
    if (productIds.length === 0) {
      await Vendor.findByIdAndUpdate(vendorMainId._id, {
        rating: 0, 
        numReviews: 0,  
      });
      return;
    }

    // Aggregate all reviews for these products
    const result = await ProductReview.aggregate([
      { $match: { product: { $in: productIds } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const { avgRating = 0, totalReviews = 0 } = result[0] || {};

    await Vendor.findByIdAndUpdate(vendorMainId._id, {
      rating: avgRating.toFixed(1),
      numReviews: totalReviews,
    });
  } catch (err) {
    console.error("Error updating vendor rating:", err);
  }
};






export const  postReview = async(req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If there are validation errors, return the first error message
        return res.status(400).json({
            statusCode: 400, 
            success: false,        
            message: errors.array()[0].msg 
        }); 
    } 

    if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

    try {

        const { rating, comment   } = matchedData(req)     
        const {productId } = req.params
        const userId = req.user._id;


        const product = await Product.findOne({ _id: productId });

          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }

        const hasPurchased = await Order.findOne({
            user: userId,
            'orderItems.productId': productId,
            status: 'delivered', 
          });
        
          if (!hasPurchased) {
            return res.status(403).json({ message: "You can only review products that you have purchased and received." });
          }    

          const alreadyReviewed = await ProductReview.findOne({ user: userId, product: productId });

          if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed this product" });
          }


  
          const review = new ProductReview({
            product: productId,
            user: userId,
            rating,
            comment,
          });
        
          await review.save();

          const allReviews = await ProductReview.find({ product: productId });

            const totalReviews = allReviews.length;
            const averageRating =
            allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

            product.rating = averageRating;
            product.numReviews = totalReviews;

          await product.save()

          // After saving the review
          await updateVendorRating(product.user);

          return res.status(201).json({
            success: true,  
            message: "Review Submitted",
            review,
        });

        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}


export const editReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
  
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }
  
    try {
      const userId = req.user._id;
      const isAdmin = req.user.role === 'admin';
      const { productId } = req.params;
      const { rating, comment } = matchedData(req);
      const { userIdFromAdmin } = req.query;
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      let review;
  
      if (isAdmin) {
        if (!userIdFromAdmin) {
          return res.status(400).json({
            success: false,
            message: "Missing user ID for review to edit",
          });
        }
      
        review = await ProductReview.findOne({
            product: productId,
            user:new mongoose.Types.ObjectId(userIdFromAdmin),
        });  

        if (!review) {
          return res.status(404).json({
            success: false,
            message: "No review found for this user on the specified product",
          });
        }
      } else {
        // Normal user
        review = await ProductReview.findOne({ product: productId, user: userId });
  
        if (!review) {
          return res.status(404).json({
            success: false,
            message: 'Review not found or not created by you',
          });
        }
  
        const hasPurchased = await Order.findOne({
          user: userId,
          'orderItems.productId': productId,
          status: 'delivered',
        });
  
        if (!hasPurchased) {
          return res.status(403).json({
            message: "You can only review products that you have purchased and received.",
          });
        }
      }
  
      // Update review
      review.rating = rating;
      review.comment = comment;
      await review.save();
  
      // Recalculate product rating
      const allReviews = await ProductReview.find({ product: productId });
      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;
  
      product.rating = averageRating;
      product.numReviews = totalReviews;
      await product.save();
  
      await updateVendorRating(product.user);

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review,
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  



export const deleteReview = async (req, res) => {

    if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access',
        });
      }
    

     const { productId } = req.params;
     const userId = req.user._id;
      const userRole = req.user.role;

    try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let review;

    if (userRole === 'admin') {
      // Admin can delete any review by product + optional user query
      const { reviewId } = req.query;
   
      if (!reviewId) {
        return res.status(400).json({
          success: false,
          message: "Review ID is required for admin deletion",
        });
      }

      review = await ProductReview.findOne({ _id: reviewId, product: productId });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

    } else {
      // User can delete only their own review
      review = await ProductReview.findOne({ user: userId, product: productId });

      if (!review) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to delete this review",
        });
      }
    }

    await review.deleteOne();

    // Recalculate average rating after deletion
    const remainingReviews = await ProductReview.find({ product: productId });
    const totalReviews = remainingReviews.length;
    const averageRating =
      totalReviews > 0
        ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

    product.rating = averageRating;
    product.numReviews = totalReviews;
    await product.save();
       
    await updateVendorRating(product.user);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

    } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
};



export const getReviews = async (req, res) => {
        const { productId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
  try {
    // Ensure product exists
    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    const reviews = await ProductReview.find({ product: productId })
      .populate("user", "name email ") 
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const totalReviews = await ProductReview.countDocuments({ product: productId });
    console.log(totalReviews)
    const hasNextPage = page * limit < totalReviews

    return res.status(200).json({
      success: true,
      reviews,
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


export const canUserReview = async (req, res) => {
    const { productId } = req.params;
  
    // User must be logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to check review eligibility.",
      });
    }
  
    try {
      // Check if product exists
      const productExists = await Product.exists({ _id: productId });
  
      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }
  
      // Check if the user has already reviewed the product
      const alreadyReviewed = await ProductReview.exists({
        user: req.user._id,
        product: productId,
      });
  
      if (alreadyReviewed) {
        return res.status(200).json({
          success: true,
          canReview: false,
          reason: "You have already reviewed this product.",
        });
      }
  
      // Check if user has purchased and received the product
      const hasPurchased = await Order.exists({
        user: req.user._id,
        'orderItems.productId': productId,
        status: 'delivered',
      });
  
      if (!hasPurchased) {
        return res.status(200).json({
          success: true,
          canReview: false,
          reason: "You must purchase and receive this product before reviewing.",
        });
      }
  
      return res.status(200).json({
        success: true,
        canReview: true,
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  