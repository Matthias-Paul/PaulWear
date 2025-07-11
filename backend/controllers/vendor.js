import { validationResult, matchedData } from "express-validator";
import Vendor from "../models/vendors.model.js";
import User from "../models/user.model.js";



export const becomeVendor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role==="vendor" || user.role==="admin") {
      return res.status(404).json({
        success: false,
        message: "You are already a vendor",
      });
    }
                   
    const existingVendor = await Vendor.findOne({ user: userId });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to become a vendor. Please wait for approval.",
      });
    }

    const { storeName, storeLogo, businessCertificate, bio, contactNumber, email, address, state, campus, kycDocs } = matchedData(req);

    const existingStore = await Vendor.findOne({ storeName: storeName.trim() });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store name is already in use. Please choose a different name.",
      });
    }

    const newVendor = new Vendor({
      user: userId,
      storeName,
      storeSlug: storeName.toLowerCase().replace(/\s+/g, "-"),
      storeLogo,
      businessCertificate,
      bio,
      contactNumber,
      email,
      address,
      state,
      campus,
      kycDocs,
    });

    await newVendor.save();

    
    return res.status(201).json({
      success: true,
      message: "Your vendor application has been submitted for review. We will notify you by email once approved.",
      vendor: {
        storeName: newVendor.storeName,
        storeSlug: newVendor.storeSlug,
        status: newVendor.status, 
      },
    });
  } catch (error) {
    console.error("Vendor application error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};



export const getStore = async (req, res) => {
  try {

        const { search } = req.query  
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
    let filter = { status: "approved" };

    if (search) {
      filter.storeName = { $regex: search, $options: "i" };
    }

    const stores = await Vendor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!stores || stores.length === 0) {
      return res.status(200).json({
        success: false,
        stores: [],
        message: "No store found!",
      });
    }

        const totalStore = await Vendor.countDocuments(filter);
        console.log(totalStore)
        const hasNextPage = page * limit < totalStore

    return res.status(200).json({
      success: true,
      stores,
      hasNextPage
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getSingleStore = async (req, res) => {
  try {
    const { id } = req.params;

    const storeDetails = await Vendor.findById(id);

    if (!storeDetails) {
      return res.status(404).json({
        success: false,
        message: "No store details found!",
      });
    }

    return res.status(200).json({
      success: true,
      storeDetails,
    });

  } catch (error) {
    console.error(error.message); 
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const getVendorStoreDetails = async (req, res)=>{

  if (!req.user || !req.user._id || req.user.role === "customer") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
  
  const userId = req.user._id;
  
  try {
  
    const vendorStoreProfile = await Vendor.findOne({user:userId  }) 
    if (!vendorStoreProfile) {
      return res.status(404).json({
        success: false,
        message: "No store profile found!",
      });
    }   
    return res.status(200).json({
      success: true,
      vendor:vendorStoreProfile,
    });


    
  } catch (error) {
    console.error(error.message); 
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}