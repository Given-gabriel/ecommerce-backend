import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";

/////////// POST /api/orders /////////////////////
export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "price"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    })),
    totalPrice,
  });

  await order.save();

  //clear cart after order
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

///////// GET /api/orders/my //////////////////
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product",
    "title price images"
  );
  res.json(orders);
});

//////////Admin: update Order status ///////////////
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.parans.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();

  res.json(order);
});

/////////// GET all orders: admin only //////////////
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("items.product", "title price images");

  res.json(orders);
});
