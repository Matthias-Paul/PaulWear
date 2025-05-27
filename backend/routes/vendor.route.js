import express from "express"
import { becomeVendor } from "../controllers/vendor.js"
import { validateVendor  } from "../middleware/validation.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.post("/become-vendor" , verifyUser, validateVendor,  becomeVendor)




   
export default router

   



