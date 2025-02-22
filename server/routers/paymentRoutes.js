import express from "express";
import {
  createVNPayPayment,
  handleVNPayIPN,
  handleVNPayReturn,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-vnpay-payment", createVNPayPayment);
router.get("/vnpay-ipn", handleVNPayIPN);
router.get("/vnpay-return", handleVNPayReturn);

export default router;
