import express from "express";
import { webHook, makePayment } from "../controllers/payment.js";

const router = express.Router();

router.post("/webhook/paystack", express.raw({ type: 'application/json' }), webHook);

router.post("/pay/init", express.json(), makePayment);

export default router;
