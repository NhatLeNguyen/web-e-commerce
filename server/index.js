import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routers/authRoutes.js";
import productRoutes from "./routers/productRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import avatarRoutes from "./routers/avatarRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware parse JSON
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://web-e-commerce-client.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// router
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/orders", orderRoutes);

//api chatbot
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const pythonCommand = process.platform === "win32" ? "python" : "python3";
  exec(
    `${pythonCommand} generate_response.py "${message}"`,
    { cwd: __dirname },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res
          .status(500)
          .send(`Error generating response: ${error.message}`);
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).send(`Error generating response: ${stderr}`);
      }
      res.send(stdout.trim());
    }
  );
});

// connect database
connectDB();

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
