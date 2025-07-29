import express from "express"
import { requestToken, verifyAndResetPassword } from "../controllers/token.js"
import {  validateEmailForRequestToken, validateTokenAndResetPassword } from "../middleware/validation.js"

const router = express.Router()

router.post("/reset-password/request-token" , validateEmailForRequestToken, requestToken)
router.post("/reset-password/verify-token" , validateTokenAndResetPassword, verifyAndResetPassword)
   



   
export default router

   





