import express from "express";
import auth from "../middlewares/auth.js";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getOrders);
router.get("/user/:userId", auth, orderController.getOrdersByUser);

export default router;
