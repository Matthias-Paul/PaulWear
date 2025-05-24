import express from "express"
import { addUser, getUsers, editUser, deleteUser } from "../controllers/admin.js"
import { registerValidation  } from "../middleware/validation.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.get("/admin/user" , verifyUser,  getUsers)
router.post("/admin/user" , verifyUser, registerValidation,  addUser)
router.put("/admin/user/:id" , verifyUser,  editUser)
router.delete("/admin/user/:id" , verifyUser,  deleteUser)



   
export default router

   



