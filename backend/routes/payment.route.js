
import express from "express"
import { makePayment, webHook } from "../controllers/payment.js"
import { verifyUser } from "../middleware/verifyUser.js"
import {  } from "../middleware/validation.js"

const router = express.Router()
          
router.post("/pay/init", makePayment)    
router.post("/webhook/paystack", webHook)    


   
export default router

