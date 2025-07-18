import express from "express"
import { becomeVendor, getStore, getSingleStore, getVendorStoreDetails, getWeeklyOrderStats, editVendorStoreDetails, getBestStore } from "../controllers/vendor.js"
import { validateVendor  } from "../middleware/validation.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.post("/become-vendor" , verifyUser, validateVendor,  becomeVendor)
router.get("/vendor-store" ,   getStore)
router.get("/best-store" ,   getBestStore)
router.get("/vendor-weekly-stats" , verifyUser,  getWeeklyOrderStats)
router.get("/vendor-profile" , verifyUser,  getVendorStoreDetails)
router.put("/vendor-profile" , verifyUser, validateVendor, editVendorStoreDetails)
router.get("/vendor-store/:id" ,   getSingleStore)




   
export default router

   



