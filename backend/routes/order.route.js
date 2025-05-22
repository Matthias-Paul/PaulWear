import express from "express"
import { getOrders, getOrderDetails, getVendorOrders } from "../controllers/order.js"
import { verifyUser } from "../middleware/verifyUser.js"
import {  } from "../middleware/validation.js"

const router = express.Router()

router.get("/orders", verifyUser, getOrders)
router.get("/orders/vendor",  verifyUser, getVendorOrders)
router.get("/orders/:id",  verifyUser, getOrderDetails)


   
export default router

