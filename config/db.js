import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // DO NOT exit the process
  }
};

export default connectDb;
