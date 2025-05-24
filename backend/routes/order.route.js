import express from "express"
import { getOrders, getOrderDetails, getVendorOrders, getAllOrders, editVendorOrders } from "../controllers/order.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { editVendorOrderValidation } from "../middleware/validation.js"

const router = express.Router()

router.get("/orders", verifyUser, getOrders)
router.get("/orders/admin",  verifyUser, getAllOrders)
router.get("/orders/vendor",  verifyUser, getVendorOrders)
router.put("/orders/vendor/:orderId",  verifyUser, editVendorOrderValidation, editVendorOrders)
router.get("/orders/:id",  verifyUser, getOrderDetails)


   
export default router

