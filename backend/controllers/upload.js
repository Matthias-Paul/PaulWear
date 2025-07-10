import express from "express"
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';  // its neccessary for you to import v2 of cloudinary
import streamifier from "streamifier"
import dotenv from "dotenv";
import sharp from "sharp"; 
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import Checkout from "../models/checkout.model.js"
import { validationResult, matchedData } from "express-validator"

       
dotenv.config();
         
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const storage = multer.memoryStorage()

export const upload = multer({
  storage,   
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});
   
    

export const uploadImage = async( req, res)=>{
 
    if(!req.file) {
        return res.status(400).json({
            statusCode: 400,
            success: false,  
            message:"No file uploaded" 
        });
    }

   try {

    const processedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality: 80 })  
      .toBuffer();

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(processedBuffer);

    // 3️⃣ Return success response
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};