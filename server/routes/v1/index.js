import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js"
import productRoutes from "./endpoints/productRoutes.js"
import cartRoutes from "./endpoints/cartRoutes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/product",productRoutes);
router.use("/cart",cartRoutes);

export default router;
