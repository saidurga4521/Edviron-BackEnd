import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { rateLimit } from "express-rate-limit";

import connectDB from "./src/configs/mongoose.js";
import routes from "./src/routes/index.js";
import School from "./src/models/school.model.js";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later.",
});

connectDB().then(() => {
  console.log("✅ MongoDB Connected Successfully");
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
