import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size: String,
    color: String,
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor", 
        required: true
    }, 
            
    orderGroupId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkout"
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
            type: String, 
            required: true   
        },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    reference: { 
        type: String, 
        required: true 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    buyerPhoneNumber: { 
        type: String, 
    },
    buyerName: { 
        type: String, 
    },
    isPaid: { 
        type: Boolean, 
        default: false 
    },   
    paidAt: { 
        type: Date 
    },
    isDelivered: { 
        type: Boolean, 
        default: false 
    },
    deliveredAt: { 
        type: Date 
    },  
    isPayoutSuccess: { 
        type: Boolean, 
        default: false 
    },
    isPayoutDate: { 
        type: Date 
    },         
     isReceived: { 
        type: Boolean, 
        default: false    
    },
    receivedAt: { 
        type: Date     
    },
    paymentStatus: {
        type: String,  
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["processing", "delivered", "cancelled"],
        default: "processing"
    },

      isCanceled: {
        type: Boolean,
        default: false,
      },
      cancelRequested: {
        type: Boolean,
        default: false,
      },
      cancelReason: {
        type: String,
      },    
     
      
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
