import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
} from "../controllers/productController.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/reviews", auth, addReview);

export default router;
