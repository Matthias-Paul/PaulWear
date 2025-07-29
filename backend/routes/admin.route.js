import express from "express";
import {
  addUser,
  getUsers,
  deleteUser,   
  validateVendor,
  getAllStore,
  deleteOrderByAdmin,
  getStats,
  getChart,
  getRecentActivities,
  getPayoutHistory,
  getVendors,
  getOrders,
  markOrderAsReceived,
  getDeletedOrders,
  getOrderDetails,
  getVendorsAccount,
} from "../controllers/admin.js";

import { registerValidation } from "../middleware/validation.js";
import { verifyUser } from "../middleware/verifyUser.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();                         

router.get("/admin/user", verifyUser, isAdmin, getUsers);
router.post("/admin/user", verifyUser, isAdmin, registerValidation, addUser);
router.get("/admin/store", verifyUser, isAdmin, getAllStore);
router.get("/admin/stats", verifyUser, isAdmin, getStats);
router.get("/admin/chart", verifyUser, isAdmin, getChart);
router.get("/admin/vendors", verifyUser, isAdmin, getVendors);
router.get("/admin/orders", verifyUser, isAdmin, getOrders);
router.get("/admin/deletedOrders", verifyUser, isAdmin, getDeletedOrders);
router.get("/admin/vendorsAccount", verifyUser, isAdmin, getVendorsAccount);

router.get("/admin/recent-activity", verifyUser, isAdmin, getRecentActivities);
router.get("/admin/payout-history", verifyUser, isAdmin, getPayoutHistory);
router.put("/admin/vendor/:id", verifyUser, isAdmin, validateVendor);
router.put("/admin/order/:id", verifyUser, isAdmin, markOrderAsReceived);
router.get("/admin/deletedOrders/:id", verifyUser, isAdmin, getOrderDetails)

router.delete("/admin/user/:id", verifyUser, isAdmin, deleteUser);
router.delete(
  "/admin/delete-order/:orderId",
  verifyUser,
  isAdmin,
  deleteOrderByAdmin
);

export default router;
