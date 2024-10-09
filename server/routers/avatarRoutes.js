import express from "express";
import { uploadAvatar } from "../controllers/avatarController.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/:id", auth, upload.single("avatar"), uploadAvatar);

export default router;
