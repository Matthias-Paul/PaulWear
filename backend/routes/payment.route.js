
import express from "express"
import { makePayment, webHook } from "../controllers/payment.js"
import { verifyUser } from "../middleware/verifyUser.js"
import {  } from "../middleware/validation.js"
import bodyParser from 'body-parser';


const router = express.Router()
          
router.post("/pay/init", makePayment)    
router.post("/webhook/paystack", bodyParser.raw({ type: 'application/json' }),  webHook)    

   
   
export default router

