import express from "express"
import { addCart } from "../controllers/cart.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateCartItem } from "../middleware/validation.js"

const router = express.Router()

router.post("/cart",  validateCartItem, addCart)

   
export default router

