// api/routes/chat.route.js
import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";

const router = express.Router();

// POST /api/chat
router.post("/", chatHandler);

export default router;
