import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
  },
  storeSlug: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
  },
  storeLogo: {
    type: String, 
    required: true,
  },
  businessCertificate: {
    type: String, 
  },
  bio: {
    type: String,
    default: '',
    required: true,
    maxlength: 300,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true, 
  },
  campus: {
    type: String,
    required: true,
  },
             
  totalProducts: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  kycDocs: {
    type: [String],
  },

}, { timestamps: true});

vendorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
