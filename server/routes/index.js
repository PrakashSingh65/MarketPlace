import { Router } from "express";

import v1Routes from "./v1/index.js";
import authRoutes from "./v1/endpoints/authRoutes.js";
import cartRoutes from "./v1/endpoints/cartRoutes.js";
import orderRoutes from "./v1/endpoints/orderRoutes.js";
import paymentRoutes from "./v1/endpoints/paymentRoutes.js";
import productRoutes from "./v1/endpoints/productRoutes.js";

const router = Router();

router.use("/v1", v1Routes);
router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/products", productRoutes);

export default router;