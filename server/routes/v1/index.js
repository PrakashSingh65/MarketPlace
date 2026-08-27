import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js"
import productRoutes from "./endpoints/productRoutes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/product",productRoutes);

export default router;
