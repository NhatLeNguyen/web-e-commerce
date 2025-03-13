import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", auth, changePassword);

export default router;
