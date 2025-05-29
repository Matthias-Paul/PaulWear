import express from "express"
import { addCart, editCart, deleteCart, getUserCart, mergeUserCart } from "../controllers/cart.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateCartItem, validateEditCartItem, validateDeleteCartItem  } from "../middleware/validation.js"

const router = express.Router()

router.post("/cart",  validateCartItem, addCart)
router.put("/cart",  validateEditCartItem, editCart)
router.get("/cart", getUserCart)
router.post("/cart/merge", verifyUser, mergeUserCart) // merge guest cart and when he/she login cart 
router.delete("/cart/:productId", validateDeleteCartItem, deleteCart)
         
   
export default router

