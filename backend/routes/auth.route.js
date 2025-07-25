import express from "express"
import {registerValidation, loginValidation } from "../middleware/validation.js"
import { registerUser, loginUser, logoutUser, googleAuth } from "../controllers/auth.js"
const router = express.Router()




router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, loginUser)
router.post("/googleAuth", googleAuth)
router.get("/logout", logoutUser)
   
export default router

              