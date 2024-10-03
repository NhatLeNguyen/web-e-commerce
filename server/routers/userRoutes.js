import express from "express";
import {
  getUserById,
  updateUser,
  getAllUsers,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getAllUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);

export default router;
