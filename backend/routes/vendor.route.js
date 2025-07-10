import express from "express"
import { becomeVendor, getStore, getSingleStore } from "../controllers/vendor.js"
import { validateVendor  } from "../middleware/validation.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.post("/become-vendor" , verifyUser, validateVendor,  becomeVendor)
router.get("/vendor-store" ,   getStore)
router.get("/vendor-store/:id" ,   getSingleStore)




   
export default router

   



