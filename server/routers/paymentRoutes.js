import express from "express";
import {
  createVNPayPayment,
  handleVNPayIPN,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-vnpay-payment", createVNPayPayment);
router.get("/vnpay-ipn", handleVNPayIPN);

export default router;
