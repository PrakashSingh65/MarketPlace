import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js";
import productRoutes from "./endpoints/productRoutes.js";
import cartRoutes from "./endpoints/cartRoutes.js";
import orderRoutes from "./endpoints/orderRoutes.js";
import paymentRoutes from "./endpoints/paymentRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);

export default router;
