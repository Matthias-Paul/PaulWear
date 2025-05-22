import express from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import streamifier from "streamifier"
import dotenv from "dotenv";
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import Checkout from "../models/checkout.model.js"
import { validationResult, matchedData } from "express-validator"


dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// MULTER SET UP

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
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
        const streamUpload =(fileBuffer)=>{

            return new Promise((resolve, reject)=>{
               const stream = cloudinary.uploader.upload_stream((error, result)=>{
                    if(result){
                        resolve(result)
                    } else{
                        reject(error)
                    }
               })
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }

        const result = await streamUpload(req.file.buffer)

        return res.status(200).json({
            success: true,
            message: "Image upload successfully",
            imageUrl: result.secure_url
        });

    } catch (error) {  
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}