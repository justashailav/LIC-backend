import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./config/db.js"
import cors from "cors";
import planRoute from "./routes.js/planCategoryRoute.js"
import aiRoute from "./routes.js/aiRoute.js"
import loginRoute from "./routes.js/loginRoute.js"
const app=express();
dotenv.config({});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://licfrontend.netlify.app"
  ],
  credentials: true
};



const PORT = process.env.PORT || 4000;
app.use(cors(corsOptions));
connectDb()


app.use("/api/v1",planRoute);
app.use("/api/v1",aiRoute);
app.use("/api/v1",loginRoute);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})
