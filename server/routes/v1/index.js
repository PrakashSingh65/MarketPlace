import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js"
import cartRoutes from "./endpoints/cartRoutes.js";
import orderRoutes from "./endpoints/orderRoutes.js";
import paymentRoutes from "./endpoints/paymentRoutes.js";
import productRoutes from "./endpoints/productRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/products", productRoutes);

export default router;
