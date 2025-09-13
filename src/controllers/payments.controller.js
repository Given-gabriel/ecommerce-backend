import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import Product from "../models/products.model.js";

export const mockPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const { totalCost } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isSuccess = totalCost === order.totalPrice;

  if (isSuccess) {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (item.quantity > product.stock) {
        res.status(400);
        throw new Error({
          message: "Insufficient stock for product ",
          product: product.title,
        });
      }
    }
    order.status = "Paid";
    order.paymentResult = {
      id: "MOCK_" + Date.now(),
      status: "Succeeded",
    };
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }
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
