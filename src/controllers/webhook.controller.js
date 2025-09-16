import OrderStatus from "../models/orderStatus.model.js";
import sendResponse from "../utils/response.js";

export const paymentWebhook = async (req, res) => {
  try {
    const { order_info } = req.body;
    if (!order_info?.order_id) {
      return sendResponse(res, false, "Invalid payload", null, 400);
    }
    const updated = await OrderStatus.findOneAndUpdate(
      {
        collect_request_id: order_info.order_id,
      },
      {
        status: order_info.status.toUpperCase(),
        order_amount: order_info.order_amount,
        transaction_amount: order_info.transaction_amount,
        gateway: order_info.gateway,
        bank_reference: order_info.bank_reference,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payemnt_details,
        payment_message: order_info.Payment_message,
        payment_time: order_info.payment_time,
        error_message: order_info.error_message,
      },
      { new: true }
    );
    console.log("the last line");
    if (!updated) {
      return sendResponse(res, false, "Order not found", null, 404);
    }
    console.log("✅ Webhook Updated:", updated);
    return sendResponse(res, true, "Order updated successfully", updated, 200);
  } catch (error) {
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
