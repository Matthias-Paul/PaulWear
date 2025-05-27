import express from "express"
import Product from "../models/product.model.js"
import Vendor from "../models/vendors.model.js"

import { validationResult, matchedData } from "express-validator"


export const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a product.",
      });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      sizes,
      colors,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = matchedData(req);

    let vendorInfo = {
      vendorStoreName: "Admin",
      vendorStoreLogo: "",
      vendorStoreEmail: "pauladesina117@gmail.com",
      vendorContactNumber: "+2348054696701",
    };

    if (req.user.role === "vendor") {
      const vendor = await Vendor.findOne({ user: req.user._id }).populate(
        "user",
        "name"
      );
      if (!vendor) {
        return res.status(400).json({
          success: false,
          message: "Vendor profile not found.",
        });
      }
      vendorInfo = {
        vendorStoreName: vendor.storeName,
        vendorStoreLogo: vendor.storeLogo,
        vendorStoreEmail: vendor.email,
        vendorContactNumber: vendor.contactNumber,
      };
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      sizes,
      colors,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
      ...vendorInfo, 
    });

    const createdProduct = await product.save();

    return res.status(201).json({
      success: true,
      createdProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({    
        success: false,
        message: "SKU must be unique",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const editProduct = async(req, res, next)=>{

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

        if(!req.user){
            return res.status(403).json({
                success: false,
                message: "Unthorized user.",
            });
        }
        const { id } = req.params

        const {
            name,
            description, 
            price, 
            discountPrice, 
            countInStock,   
            category,
            sizes,
            colors,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
            
        }
         = matchedData(req)

        if(req.user.role !== "admin"  &&  req.user.role !== "vendor" ){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit a product.",
            });
        }

        
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        if(req.user.role === "vendor"  && product.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,     
                message: "You are not allowed to edit this product.",
            });
        }
     
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                sizes,
                colors,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku
            },
            { new: true, runValidators: true }
            );


        return res.status(200).json({
            success: true,
            updatedProduct,
            message: "Product edited successfully"
        }); 

    } catch (error) {
        console.log(error)   
            if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,  
                message: "SKU must be unique" 
            });
            }

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",     
        });     
    }

} 

export const deleteProduct = async(req, res, next)=>{


    try {           

        if(!req.user){
            return res.status(403).json({
                success: false,
                message: "Unauthorized user.",
            });
        }
        const { id } = req.params


        if(req.user.role !== "admin"  &&  req.user.role !== "vendor" ){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete a product.",
            });
        }

        
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        if(req.user.role === "vendor"  && product.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,     
                message: "You are not allowed to delete this product.",
            });
        }
     
         await Product.findByIdAndDelete(id)
           
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        }); 

    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });     
    }

} 
      
                    
export const getProducts = async(req, res, next)=>{
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,

        } =req.query

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
    
    try {
        let query = {}
        let sort = {}

        if(collection && collection.toLocaleLowerCase() !== "all" ){
            query.collections = collection
        }

        if(category && category.toLocaleLowerCase() !== "all" ){
            query.category = category
        }   


        if(size){
            query.sizes = { $in: size.split(",") }
        }

        if(color){
            query.colors = { $in: [color] }
        }

         if(gender){
            query.gender = gender
        }

        if(minPrice || maxPrice){
            query.price = {}
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)

        }

        if(search){
            query.$or = [
                {name : {$regex: search, $options: "i"  }},
                {description : {$regex: search, $options: "i"  }},
                {category : {$regex: search, $options: "i"  }},

 
            ]
        }

        if(sortBy){
            switch (sortBy){
                case "priceAsc":
                    sort = {price: 1}
                    break;
                case "priceDesc":
                    sort = {price: -1}
                    break;
                case "popularity":
                    sort = {rating: -1}
                    break;
                default:
                    break;
            }
        }

        const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

        if(products.length === 0){
            return res.status(200).json({
            success: true,  
            products: [],
            message: "No products available",
        }); 
        }


        return res.status(200).json({
            success: true,
            products  
        });  

    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });   
    }
}
          
         
export const getSingleProduct =async(req, res, next)=>{

    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
                success: false,  
                message: "No product found",
            }); 
        }


        return res.status(200).json({
            success: true,    
            product 
        }); 

    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}
         
export const getSimilarProduct = async(req, res, next)=>{

        const { id } = req.params;

    try {
        
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
                success: false,  
                message: "No product found",
            }); 
        }

        const similarProduct = await Product.find({
            _id: { $ne: id },// exclude the current product id
            gender: product.gender,
            category: product.category
        }).limit(4)

        if(similarProduct.length === 0){
            return res.status(404).json({
                success: false,  
                message: "No similar products available",
            }); 
        }

        return res.status(200).json({
            success: true, 
            similarProduct 
        });           
               

    } catch (error) {
        console.log(error)   

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }


}                  


export const bestSeller = async(req, res, next)=>{


    try {
        
        const bestSeller = await Product.findOne().sort({ rating : -1})

        if(!bestSeller || bestSeller.length === 0){
                return res.status(404).json({
                    success: false,  
                    message: "No best product found",
                }); 
            }

            return res.status(200).json({
                success: true,  
                bestSeller
            });     

    } catch (error) {
        console.log(error)       

        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    } 
} 

export const newArrivals = async(req, res, next)=>{

    try {  

        const newArrivals = await Product.find().sort({createdAt: -1 }).limit(8)

        if(!newArrivals || newArrivals.length === 0){
                return res.status(404).json({
                    success: false,  
                    message: "No new arrival products found",
                }); 
            }

            return res.status(200).json({
                success: true,  
                newArrivals
            });


    } catch (error) {
        console.log(error.message)
        
        return res.status(500).json({
            success: false,  
            message: "Internal Server Error",
        });
    }
}
     

export const getVendorProducts = async (req, res) => {
  try {
    if (!req.user || !req.user._id || req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const vendorProducts = await Product.find({ user: req.user._id }).sort({ createdAt: -1});

    if (!vendorProducts || vendorProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have no products",
      });
    }

    return res.status(200).json({
      success: true,
      vendorProducts,
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
