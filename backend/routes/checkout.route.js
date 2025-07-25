import express from "express"
import { createCheckout, payCheckout, finalizeCheckout } from "../controllers/checkout.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { validateCheckout } from "../middleware/validation.js"

const router = express.Router()

router.post("/checkout", verifyUser, validateCheckout,  createCheckout)
router.put("/checkout/:id/pay", verifyUser,  payCheckout)
router.post("/checkout/:id/finalize", verifyUser,  finalizeCheckout)


   
export default router

   



