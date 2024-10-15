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

import path from "path";
import { fileURLToPath } from "url";

import { google } from "googleapis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MEASUREMENT_ID = "G-X34NWK577Z";

const analytics = google.analyticsdata({
  version: "v1beta",
  auth: "AIzaSyDF9SpZPy8daiOTl6MiN0htprCTveoUYzg",
});

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

//google analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const response = await analytics.runReport({
      property: `properties/${MEASUREMENT_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      dimensions: [{ name: "month" }],
    });

    const data = response.data.rows.map((row) => ({
      month: row.dimensionValues[0].value,
      visitors: parseInt(row.metricValues[0].value, 10),
      pageViews: parseInt(row.metricValues[1].value, 10),
    }));

    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).send("Failed to fetch data");
  }
});
// connect database
connectDB();

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
