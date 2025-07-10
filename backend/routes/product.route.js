import express from "express"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateProduct } from "../middleware/validation.js"
import { createProduct, editProduct, deleteProduct, getProducts, getSingleProduct, getSimilarProduct, bestSeller, newArrivals, getVendorProducts, getProductsPerVendor, countProducts, categoryProducts } from "../controllers/product.js"
const router = express.Router()

        
    
router.get("/product/category", categoryProducts)
router.get("/product", getProducts)           
router.get("/product/best-seller", bestSeller)
router.get("/product/new-arrivals", newArrivals)
router.get("/product/vendor", verifyUser, getVendorProducts)
router.post("/product", verifyUser, validateProduct, createProduct)
router.put("/product/:id", verifyUser, validateProduct, editProduct)
router.delete("/product/:id", verifyUser, deleteProduct)
router.get("/product/vendor-products/:id",  getProductsPerVendor)
router.get("/product/:id", getSingleProduct)
router.get("/product/similar/:id", getSimilarProduct)   
router.get("/product/:vendorId/count", countProducts)


           
export default router

