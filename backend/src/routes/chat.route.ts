import express from "express";
import { chatWithBrain } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, chatWithBrain);

export default router;