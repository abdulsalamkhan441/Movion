import express from "express";
import { aiRecommend } from "../controllers/aicommand.js";

const router = express.Router();

router.post("/ai-recommend", aiRecommend);

export default router;

