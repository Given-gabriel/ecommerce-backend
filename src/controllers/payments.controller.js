import asyncHandler from "express-async-handler";
import Order from "../models/order.js";

export const mockPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const totalCost = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isSuccess = totalCost === order.totalPrice;

  if (isSuccess) {
    order.status = "Paid";
    order.paymentResult = {
      id: "MOCK_" + Date.now(),
      status: "Succeeded",
    };
  } else {
    order.status = "Failed";
    order.paymentResult = {
      id: "MOCK_" + Date.now(),
      status: "Failed",
    };
  }

  await order.save();
  res.json({ message: "Payment simulated", order });
});
