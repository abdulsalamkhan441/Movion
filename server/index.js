import express from "express";
import dotenv from "dotenv";
import aiRecommend from "./routes/airecommend.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // tighten in prod
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/api/ai-recommend", aiRecommend);

// health-check for debugging
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));