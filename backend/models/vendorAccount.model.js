

import mongoose from "mongoose";

const vendorAccountSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
    unique: true
  },  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true    
  },
  bankAccountNumber: {
    type: String, 
    required: true,
    trim: true
  },
  bankCode: {
    type: String,
    required: true,
    trim: true
  },    
  accountName: {
    type: String,
    trim: true
  },
  bankName:{
    type: String,
    required: true,
  },
  recipientCode: {
    type: String, 
    trim: true
  },
  totalBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const VendorAccount = mongoose.model("VendorAccount", vendorAccountSchema);
export default VendorAccount;
