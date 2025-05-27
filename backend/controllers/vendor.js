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
