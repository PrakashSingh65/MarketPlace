import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js";
import productRoutes from "./endpoints/productRoutes.js";
import cartRoutes from "./endpoints/cartRoutes.js";
import orderRoutes from "./endpoints/orderRoutes.js";
import paymentRoutes from "./endpoints/paymentRoutes.js";
import userRoutes from "./endpoints/userRoutes.js";
import inquiryRoutes from "./endpoints/inquiryRoutes.js";
import aiRoutes from "./endpoints/aiRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/products", productRoutes); // Plural alias for safety
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/orders", orderRoutes); // Plural alias for safety
router.use("/payment", paymentRoutes);
router.use("/payments", paymentRoutes); // Plural alias for safety
router.use("/user", userRoutes); // Singular alias for safety
router.use("/users", userRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/inquiry", inquiryRoutes);
router.use("/ai", aiRoutes);

// Direct root aliases for auth (e.g. /api/v1/login, /api/login)
router.use("/", authRoutes);

export default router;
