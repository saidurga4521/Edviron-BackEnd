import OrderStatus from "../models/orderStatus.model.js";
import dotenv from "dotenv";
import sendResponse from "../utils/response.js";
dotenv.config({ quiet: true });
import mongoose from "mongoose";
export const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sort = "payment_time",
      order = "desc",
    } = req.query;

    const matchStage = status ? { status } : {};

    const transactions = await OrderStatus.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      { $match: { "orderInfo.trustee_id": req.user.id } },
      {
        $project: {
          collect_id: 1,
          school_id: "$orderInfo.school_id",
          student_info: "$orderInfo.student_info",
          gateway: "$orderInfo.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$orderInfo._id",
          payment_time: 1,
        },
      },
    ]);

    return sendResponse(
      res,
      true,
      "Trnasactions fetched successfully",
      transactions,
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};

// Get Transactions by School
export const getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactionsBySchool = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      { $match: { "orderInfo.school_id": schoolId } },
      {
        $project: {
          collect_id: 1,
          school_id: "$orderInfo.school_id",
          student_info: "$orderInfo.student_info",
          gateway: "$orderInfo.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$orderInfo._id",
          payment_time: 1,
        },
      },
    ]);

    return sendResponse(
      res,
      true,
      "Trnasactions By School fetched successfully",
      transactionsBySchool,
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};

// Get Transaction Status
export const getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const orderStatus = await OrderStatus.findOne({
      collect_id: new mongoose.Types.ObjectId(custom_order_id),
    });

    if (!orderStatus) {
      return sendResponse(res, false, "transaction not found", null, 404);
    }
    return sendResponse(
      res,
      true,
      "Trnasactions fetched successfully",
      { status: orderStatus.status },
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};
