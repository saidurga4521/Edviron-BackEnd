import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("the uri", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Data",
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};

export default connectDB;
