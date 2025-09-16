import express from "express";
import isLoggedIn from "../middlewares/isLoggedin.js";
import { paymentWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();
router.post("/webhookPayment", isLoggedIn, paymentWebhook);
export default router;
