import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true
    },
    description: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    discountPrice: {
        type:Number
    },
    countInStock: {    
        type:Number,  
        required: true,    
        default:0
    },
    sku: {    
        type:String,       
        unique:true,
        index: true,
        required: true          
    },          
   

    category: {
        type:String,
        enum: ["Fashion And Apparel", "Hair And Beauty Products", "Bags And Accessories", "Baked Goods And Snacks", "Beverages", " Foodstuff And Provisions", "Health and Personal Care Products","Others"],
        required: true
    },
    
    sizes: {
        type:[String],
        required: true
    },
    colors: {
        type:[String],
        required: true
    },      
    gender: {     
        type: String,
        enum:["Men", "Women", "Unisex"]
    },
    vendorStoreName: {     
        type: String,
        required:true
    },
    vendorStoreLogo: {     
        type: String,
    },
    vendorStoreEmail: {     
        type: String,
        required:true
    },   
    vendorContactNumber: {     
        type: String,
        required:true
    },

    images: [{
        url: {
            type: String,
            required: true
        },
        altText: {
            type: String
        }
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    dimensions: {
        length: Number,
        height: Number,
        width: Number
    },    
    weight: Number   

},{ timestamps: true })   

const Product = mongoose.model("Product", productSchema)

export default Product;
