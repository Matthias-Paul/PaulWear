
import mongoose from "mongoose";

const vendorPayoutSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  transaction: {
    type:String,
    ref: "Transaction",
    required: true
  },
  payoutAmount: {
    type: Number,
    required: true
  },
  feeDeducted: {
    type: Number,
    required: true       
  },
  transferReference: {
    type: String,
    trim: true
  },    
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  reason: {
    type: String,
    trim: true
  },
  initiatedAt: {  
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, { timestamps: true });

const VendorPayout = mongoose.model("VendorPayout", vendorPayoutSchema);
export default VendorPayout;
