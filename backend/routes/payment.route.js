import express from "express";
import { webHook, makePayment } from "../controllers/payment.js";
import bodyParser from "body-parser";

const router = express.Router();

// Don't parse webhook body as JSON — use raw
router.post("/webhook/paystack", bodyParser.raw({ type: "application/json" }), webHook);

// Other routes
router.post("/pay/init", express.json(), makePayment);

export default router;
