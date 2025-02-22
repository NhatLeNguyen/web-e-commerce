import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//routes
import authRoutes from "./routers/authRoutes.js";
import productRoutes from "./routers/productRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import avatarRoutes from "./routers/avatarRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";
import chatRoutes from "./routers/chatRoutes.js";
import createPaymentRoutes from "./routers/paymentRoutes.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import path from "path";
import { fileURLToPath } from "url";

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
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
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
app.use("/api/chat", chatRoutes);
app.use("/api/create_payment", createPaymentRoutes);
// connect database
connectDB();

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to create dataset
// const createDataset = async () => {
//   try {
//     await connectDB();

//     const datasetPath = path.join(__dirname, "badminton_dataset", "train");
//     const categoriesPath = {
//       racket: path.join(datasetPath, "rackets"),
//       shoes: path.join(datasetPath, "shoes"),
//     };

//     // Tạo các thư mục nếu chưa tồn tại
//     for (const category in categoriesPath) {
//       if (!fs.existsSync(categoriesPath[category])) {
//         fs.mkdirSync(categoriesPath[category], { recursive: true });
//       }
//     }

//     // Lấy tất cả sản phẩm từ database
//     const products = await Product.find({});

//     for (const product of products) {
//       const category = product.category.toLowerCase();
//       if (!categoriesPath[category]) continue;

//       // Xử lý từng ảnh của sản phẩm
//       for (let i = 0; i < product.images.length; i++) {
//         const fileName = `${product.name}_${i}.jpg`
//           .toLowerCase()
//           .replace(/\s+/g, "_")
//           .replace(/[^a-z0-9_\.]/g, "");

//         const imagePath = path.join(categoriesPath[category], fileName);

//         await saveImage(product.images[i], imagePath);
//         console.log(`Saved: ${imagePath}`);
//       }
//     }

//     console.log("Dataset creation completed!");
//   } catch (error) {
//     console.error("Error creating dataset:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Hàm lưu ảnh từ base64 hoặc URL
// async function saveImage(image, filePath) {
//   try {
//     if (image.startsWith("data:image")) {
//       // Xử lý ảnh base64
//       const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//       fs.writeFileSync(filePath, base64Data, "base64");
//     } else {
//       // Xử lý ảnh từ URL
//       const response = await axios.get(image, { responseType: "arraybuffer" });
//       fs.writeFileSync(filePath, response.data);
//     }
//     console.log(`Image saved to ${filePath}`);
//   } catch (error) {
//     console.error(`Error saving image to ${filePath}:`, error);
//   }
// }

//Gọi hàm createDataset để tạo dataset
// createDataset();
