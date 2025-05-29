import express from "express"
import { addUser, getUsers, deleteUser, validateVendor, getAllStore } from "../controllers/admin.js"
import { registerValidation  } from "../middleware/validation.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.get("/admin/user" , verifyUser,  getUsers)
router.post("/admin/user" , verifyUser, registerValidation,  addUser)
router.get("/admin/store" , verifyUser,  getAllStore)
router.put("/admin/vendor/:id" , verifyUser,  validateVendor)
router.delete("/admin/user/:id" , verifyUser,  deleteUser)



   
export default router

   



