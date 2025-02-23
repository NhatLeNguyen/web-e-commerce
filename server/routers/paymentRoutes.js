import express from "express";
import {
  createVNPayPayment,
  handleVNPayIPN,
  handleVNPayReturn,
  createPaymentSession,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-vnpay-payment", createVNPayPayment);
router.post("/create-payment-session", createPaymentSession);
router.get("/vnpay-ipn", handleVNPayIPN);
router.get("/vnpay-return", handleVNPayReturn);

export default router;
