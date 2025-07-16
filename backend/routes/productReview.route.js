import express from "express"
import { postReview, editReview, deleteReview, getReviews } from "../controllers/productReview.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateReview } from "../middleware/validation.js"

const router = express.Router()
          
router.post("/product-review/:productId", verifyUser, validateReview, postReview )    
router.put("/product-review/:productId", verifyUser, validateReview, editReview )    
router.delete("/product-review/:productId", verifyUser, deleteReview )    
router.get("/product-review/:productId",  getReviews )    



   
export default router

