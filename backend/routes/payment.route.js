import express from "express";
import {
     webHook,
      makePayment,
       verifyOrder, 
       accountCreation, 
       accountUpdate, 
       getAccountDetails, 
       markAsDelivered,
       markAsReceived,  
        getListOfBanks,
        resolveName,
        payoutHistory,
    } from "../controllers/payment.js";
import bodyParser from "body-parser";
import { verifyUser } from "../middleware/verifyUser.js"
import { validateVendorAccount } from "../middleware/validation.js"

const router = express.Router();

// Don't parse webhook body as JSON — use raw
router.post("/webhook/paystack", bodyParser.raw({ type: "application/json" }), webHook);
    
// Other routes
router.post("/pay/init", express.json(), makePayment);
router.get("/orders/verify", express.json(), verifyUser, verifyOrder);
router.get("/listOfBanks",  express.json(), verifyUser, getListOfBanks  )
router.get("/vendor/resolveName", express.json(), verifyUser, resolveName );
router.post("/vendor/account", express.json(), verifyUser, validateVendorAccount, accountCreation);
router.get("/vendor/payout/history", express.json(), verifyUser, payoutHistory);
router.put("/vendor/account/update", express.json(), verifyUser, validateVendorAccount, accountUpdate);
router.get("/vendor/account", express.json(), verifyUser, getAccountDetails);
router.put("/vendor/markAsDelivered/:orderId", express.json(), verifyUser, markAsDelivered);
router.put("/vendor/markAsReceived/:orderId", express.json(), verifyUser, markAsReceived );
  
     
    



export default router;
