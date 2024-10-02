import express from "express";
import { getUserById, updateUser } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);

export default router;
