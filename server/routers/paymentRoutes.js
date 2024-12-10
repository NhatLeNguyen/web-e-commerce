import express from "express";
import { createVNPayPayment } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createVNPayPayment);

export default router;
