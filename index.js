import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "./config/db.js";
import planRoute from "./routes.js/planCategoryRoute.js";
import aiRoute from "./routes.js/aiRoute.js";
import loginRoute from "./routes.js/loginRoute.js";

dotenv.config();

const app = express();

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tejkavifuture.life",
      "https://www.tejkavifuture.life",
      "https://darkred-dove-697077.hostingersite.com",
    ],
    credentials: true,
  })
);

// Connect DB
connectDb();

// API Routes
app.use("/api/v1", planRoute);
app.use("/api/v1", aiRoute);
app.use("/api/v1", loginRoute);

// -----------------------------
// Serve Frontend (IMPORTANT)
// -----------------------------
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
