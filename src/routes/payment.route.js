import express from "express";
import isLoggedIn from "../middlewares/isLoggedin.js";
import {
  checkPaymentStatus,
  createPayment,
} from "../controllers/payment.controller.js";
const router = express.Router();
router.post("/createPayment", isLoggedIn, createPayment);
router.get("/status/:collect_request_id", isLoggedIn, checkPaymentStatus);
export default router;
