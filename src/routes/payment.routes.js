import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { mockPayment } from "../controllers/payments.controller.js";

const router = Router();

router.post("/pay", protect, mockPayment);

export default router;
