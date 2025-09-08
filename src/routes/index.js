import { Router } from "express";
import auth from "./auth.routes.js";
import products from "./products.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";

const router = Router();

router.use("/auth", auth);
router.use("/products", products);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

export default router;
