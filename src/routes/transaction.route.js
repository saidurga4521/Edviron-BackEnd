import express from "express";
import isLoggedIn from "../middlewares/isLoggedin.js";
import {
  getAllTransactions,
  getTransactionsBySchool,
  getTransactionStatus,
} from "../controllers/transactions.controller.js";
const router = express.Router();
router.get("/", isLoggedIn, getAllTransactions);
router.get("/school/:schoolId", isLoggedIn, getTransactionsBySchool);
router.get("/status/:custom_order_id", isLoggedIn, getTransactionStatus);
export default router;
