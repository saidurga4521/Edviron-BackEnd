import jwt from "jsonwebtoken";
import axios from "axios";
import Order from "../models/order.model.js";
import OrderStatus from "../models/orderStatus.model.js";
import dotenv from "dotenv";
import sendResponse from "../utils/response.js";
import School from "../models/school.model.js";
dotenv.config({ quiet: true });
const PG_SECRET = process.env.PG_SECRET;
const API_KEY = process.env.API_KEY;
const PG_URL = process.env.PG_URL;

export const createPayment = async (req, res) => {
  try {
    const { schoolId, amount, name, email, id } = req.body;
    const student_info = { id, name, email };
    const school_id = process.env.SCHOOL_ID;
    const callback_url = process.env.CALLBACK_URL;
    const trustee_id = req.user.id;
    const payload = { school_id, amount: String(amount), callback_url };
    const sign = jwt.sign(payload, PG_SECRET, { algorithm: "HS256" });
    //call payment gateway
    const response = await axios.post(
      `${PG_URL}/create-collect-request`,
      {
        school_id,
        amount: String(amount),
        callback_url,
        sign,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const { collect_request_id, collect_request_url } = response.data;
    const order = await Order.create({
      school_id: schoolId,
      trustee_id,
      student_info,
      gateway_name: "Edviron",
    });
    await OrderStatus.create({
      collect_id: order._id,
      collect_request_id,
      order_amount: amount,
      status: "PENDING",
    });
    const data = {
      payment_url: collect_request_url,
      collect_request_id,
      student_info,
    };
    return sendResponse(
      res,
      true,
      "transaction created successfully",
      data,
      200
    );
  } catch (error) {
    console.error("Payment API error:", error.response?.data || error.message);
    return sendResponse(res, false, "Transaction creation failed", null, 500);
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { collect_request_id } = req.params;
    const school_id = process.env.SCHOOL_ID;
    const payload = { school_id, collect_request_id };
    const sign = jwt.sign(payload, PG_SECRET);
    const response = await axios.get(
      `${PG_URL}/collect-request/${collect_request_id}?school_id=${school_id}&sign=${sign}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    const { status, amount } = response.data;
    await OrderStatus.findOneAndUpdate(
      { collect_request_id },
      { transaction_amount: amount, status }
    );
    return sendResponse(res, true, "status updated", response.data, 200);
  } catch (error) {
    return sendResponse(res, false, error.message, null, 500);
  }
};
