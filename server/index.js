import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routers/auth.js";
import productRoutes from "./routers/productRoutes.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
