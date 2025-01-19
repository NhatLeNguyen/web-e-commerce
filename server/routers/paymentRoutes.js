import express from "express";
import {
  createVNPayPayment,
  handleVNPayIPN,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createVNPayPayment);
router.get("/ipn", handleVNPayIPN);

export default router;
