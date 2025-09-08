import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.get("/", protect, isAdmin, getAllOrders);

export default router;
