import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true,
    },
    trustee_id: {
      type: String,
      required: true,
    },
    student_info: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
      },
    },
    gateway_name: {
      type: String,
      enum: ["Edviron"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
