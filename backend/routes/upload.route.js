import express from "express"
import {uploadImage, upload } from "../controllers/upload.js"
import { verifyUser } from "../middleware/verifyUser.js"
import { multerErrorHandler } from "../middleware/multerErrorHandler.js";

const router = express.Router()

router.post("/upload", verifyUser, upload.single("image") , multerErrorHandler ,  uploadImage)

export default router
   