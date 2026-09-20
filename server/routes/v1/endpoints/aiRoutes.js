import { Router } from "express";
import { handleAIChat } from "../../../controllers/aiController.js";

const router = Router();

// POST /api/v1/ai/chat
router.post("/chat", handleAIChat);

export default router;
