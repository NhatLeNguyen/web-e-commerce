import express from "express";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
} from "../controllers/cartController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/:userId", auth, getCart);
router.post("/:userId", auth, addItemToCart);
router.delete("/:userId/:productId", auth, removeItemFromCart);

export default router;
