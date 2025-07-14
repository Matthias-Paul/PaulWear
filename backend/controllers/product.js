import express from "express"
import Product from "../models/product.model.js"
import Vendor from "../models/vendors.model.js"
import VendorAccount from '../models/vendorAccount.model.js';
import seedrandom from 'seedrandom';



import { validationResult, matchedData } from "express-validator"




  
const generateSku = (vendorName, productName) => {
    const vendorCode = vendorName?.substring(0, 3).toUpperCase() || "SYS";
    const nameSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")  
      .substring(0, 8);          
  
    const uniquePart = Date.now().toString(36).toUpperCase().slice(-6); 
  
    return `${vendorCode}-${nameSlug}-${uniquePart}`;
  };
  
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

    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a product.",
      });
    }

    if(req.user.role === "vendor"){
        const vendorAcc = await VendorAccount.findOne({  user: req.user._id })
        if(!vendorAcc || !vendorAcc.bankAccountNumber || !vendorAcc.bankCode || !vendorAcc.recipientCode || !vendorAcc.accountName  ){
            return res.status(400).json({
                success: false,  
                message: "Submit your bank details at payout page before adding a product.",
            });        
        }
    }     
             
    const {
      name,
      description,
      price,
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
    } = matchedData(req);

    let vendorInfo = {
      vendorStoreName: "Admin",
      vendorStoreLogo: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1748783911/gwkhzbo0megprhf62s6p.jpg",
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
      category,
      sizes,
      colors,
      gender,
      images,
      isPublished: true,
      sku:generateSku(vendorInfo.vendorStoreName, name),
      user: req.user._id,
      ...vendorInfo, 
    });

    const createdProduct = await product.save();


    return res.status(201).json({
      success: true,
      createdProduct,
      message: "Product added successfully",
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
            category,
            sizes,
            colors,
            gender,
            images,
            
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
        const vendor = await Vendor.findOne({ user: product.user });
        if(!vendor){
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
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
                category,
                sizes,
                colors,
                gender,
                images,
                sku: req.user.role === "admin" ? sku : product.sku,
                
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
          
function hashSeed(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const getProducts = async (req, res) => {
  const {
    category,
    collection,
    size,
    color,  
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
  } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const filterQuery = {};

    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category.toLowerCase() !== "all") {
      filterQuery.category = decodeURIComponent(category).replace(/\+/g, " ");
    }

    if (collection && collection.toLowerCase() !== "all") {
      filterQuery.collections = collection;
    }

    if (color && color.toLowerCase() !== "all") {
      filterQuery.colors = { $in: [color] };
    }

    if (gender && gender.toLowerCase() !== "all") {
      filterQuery.gender = gender;
    }

    if (size) {
      const sizesArray = size.split(",").map((s) => s.trim());
      if (sizesArray.length > 0) {
        filterQuery.sizes = { $in: sizesArray };
      }
    }

    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) filterQuery.price.$gte = Number(minPrice);
      if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
    }

    const isInitialFeed =
    !search &&
    !sortBy &&
    !category &&
    !collection &&
    !color &&
    !gender &&
    !size &&
    !minPrice &&
    !maxPrice;
        
    const isUserSorted = Boolean(sortBy);
    const timeSegment = Math.floor(Date.now() / (30 * 60 * 1000));
    console.log('User:', req.user?.id || req.ip, 'Time Segment:', timeSegment);
    const seed = hashSeed((req.user?.id || req.ip || "guest") + "_" + timeSegment);
    console.log("Seed", seed)

    let products = [];
    
    if (!isUserSorted) {
      // Step 1: Get filtered products (only _id and randomSortKey for performance)
      const filteredIds = await Product.find(
        filterQuery,
        { _id: 1, randomSortKey: 1 }
      );
          
      const rng = seedrandom(String(seed));

      const shuffledIds = [...filteredIds]
        .map(p => ({ _id: p._id, rand: rng() }))
        .sort((a, b) => a.rand - b.rand)
        .map(p => p._id);

      const paginatedIds = shuffledIds.slice(skip, skip + limit);
      const idOrder = paginatedIds.map(id => id.toString());

      products = await Product.find({ _id: { $in: paginatedIds } });

      // Reorder according to original shuffled order
      products.sort(
        (a, b) =>
          idOrder.indexOf(a._id.toString()) - idOrder.indexOf(b._id.toString())
      );
    } else {
      // User explicitly sorted the feed (e.g., priceAsc, priceDesc)
      let sort = {};
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    
      products = await Product.find(filterQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    }

    return res.status(200).json({
      success: true,
      products,
    });


  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
  
         
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
    const {
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        search,
        category,

    } =req.query

    let filter = { user: req.user._id  };


        if(category){
            filter.category = category
        }   


        if(size){
            filter.sizes = { $in: size.split(",") }
        }

        if(color){
            filter.colors = { $in: [color] }
        }

         if(gender){
            filter.gender = gender
        }

        if(minPrice || maxPrice){
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice)
            if(maxPrice) filter.price.$lte = Number(maxPrice)

        }
       
        if(search){
            filter.$or = [
                {name : {$regex: search, $options: "i"  }},
                {description : {$regex: search, $options: "i"  }},
                {category : {$regex: search, $options: "i"  }},

 
            ]
        }   

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;



    const vendorProducts = await Product.find(filter).sort({ createdAt: -1}).skip(skip).limit(limit)

    if (!vendorProducts || vendorProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have no products",
      });
    }

        const totalProducts = await Product.countDocuments(filter);
        console.log(totalProducts)
        const hasNextPage = page * limit < totalProducts

    return res.status(200).json({
      success: true,
      vendorProducts,
      hasNextPage,
      totalProducts     
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProductsPerVendor = async (req, res) => {
  try {
   
    const {id} =req.params
          
     const {
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            search,
            category,

        } =req.query

    let filter = { user: id };
       
        if(category && category.toLocaleLowerCase() !== "all" ){
            filter.category = category
        }     


        if(size){
            filter.sizes = { $in: size.split(",") }
        }

        if(color){
            filter.colors = { $in: [color] }
        }

         if(gender){
            filter.gender = gender
        }

        if(minPrice || maxPrice){
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice)
            if(maxPrice) filter.price.$lte = Number(maxPrice)

        }     
     
        if(search){
            filter.$or = [
                {name : {$regex: search, $options: "i"  }},
                {description : {$regex: search, $options: "i"  }},

 
            ]
        }   

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        

    const vendorProducts = await Product.find(filter).sort({ createdAt: -1}).skip(skip).limit(limit)
           
    if (!vendorProducts || vendorProducts.length === 0) {
      return res.status(200).json({
        success: true,
        vendorProducts:[],
        message: "You have no products",
      });
    } 

        const totalProducts = await Product.countDocuments(filter);
        console.log(totalProducts)
        const hasNextPage = page * limit < totalProducts
            
    return res.status(200).json({
      success: true,
      vendorProducts,
      hasNextPage     
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const countProducts = async(req, res)=>{

    try {
                
         const { vendorId } = req.params;
        const count = await Product.countDocuments({ user: vendorId });
        return res.status(200).json({
            success: true,   
            totalProducts: count               
        });
    } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}


export const categoryProducts = async (req, res) => {
  try {
    const { search, sortBy, category } = req.query;

    let filter = {
      $and: [{ category }],
    };

    if (search) {
      filter.$and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    let sort = {};
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;
      case "priceDesc":
        sort = { price: -1 };
        break;
      case "popularity":
        sort = { rating: -1 };
        break;
      default:  
        sort = { createdAt: -1 }; 
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categoryProducts = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (!categoryProducts || categoryProducts.length === 0) {
      return res.status(200).json({
        success: true,
        categoryProducts: [],
        message: "No products found",
      });
    }

    const totalProducts = await Product.countDocuments(filter);
    const hasNextPage = page * limit < totalProducts;

    return res.status(200).json({
      success: true,
      categoryProducts,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
