import express from "express"
import { getOrders, getOrderDetails, getVendorOrders, getAllOrders, requestCancelOrder } from "../controllers/order.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { editVendorOrderValidation } from "../middleware/validation.js"

const router = express.Router()
          
router.get("/orders", verifyUser, getOrders)    
router.get("/orders/admin",  verifyUser, getAllOrders)
router.get("/orders/vendor",  verifyUser, getVendorOrders)
router.get("/orders/:id",  verifyUser, getOrderDetails)
router.put("/orders/cancel-request/:orderId", verifyUser, requestCancelOrder);


   
export default router

