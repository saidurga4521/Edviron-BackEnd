import mongoose from "mongoose";
const orderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    collect_request_id: {
      type: String,
    },
    order_amount: {
      type: Number,
      required: true,
    },
    transaction_amount: {
      type: Number,
    },
    payment_mode: {
      type: String,
    },
    payment_details: {
      type: String,
    },
    bank_reference: {
      type: String,
    },
    payment_message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    error_message: {
      type: String,
    },
    payment_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model("orderStatus", orderStatusSchema);
export default OrderStatus;
