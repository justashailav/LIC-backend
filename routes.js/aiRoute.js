import express from "express";
import { chatWithAI } from "../controllers/aicontroller.js";
const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
