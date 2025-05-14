import express from "express"
import { createCheckout } from "../controllers/checkout.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateCheckout } from "../middleware/validation.js"

const router = express.Router()

router.post("/checkout", verifyUser, validateCheckout,  createCheckout)


   
export default router





