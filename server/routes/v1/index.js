import { Router } from "express";

import authRoutes from "./endpoints/authRoutes.js"

const router = Router();

router.use("/auth", authRoutes);


export default router;
