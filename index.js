import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors";
import planRoute from "./routes.js/planCategoryRoute.js";
import aiRoute from "./routes.js/aiRoute.js";
import loginRoute from "./routes.js/loginRoute.js";

dotenv.config();

const app = express();

// 🔹 Global crash protection
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tejkavifuture.life",
      "https://www.tejkavifuture.life",
      "https://darkred-dove-697077.hostingersite.com"
    ],
    credentials: true
  })
);

// 🔹 Root test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔹 API routes
app.use("/api/v1", planRoute);
app.use("/api/v1", aiRoute);
app.use("/api/v1", loginRoute);

// 🔹 Start server ONLY after DB connects
const PORT = process.env.PORT || 4000;

connectDb()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
