import express from "express"
import { addSubscriber } from "../controllers/subscriber.js"
import { validateSubscriber } from "../middleware/validation.js"

const router = express.Router()

router.post("/subscribe", validateSubscriber ,  addSubscriber)



   
export default router

   



