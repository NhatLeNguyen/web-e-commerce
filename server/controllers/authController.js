import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: result._id,
      fullName: result.fullName,
      email: result.email,
      role: result.role,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ message: "Refresh token expired" });
    } else {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  }
};

// const convertImageToBase64 = async (url) => {
//   const response = await axios.get(url, { responseType: "arraybuffer" });
//   const buffer = Buffer.from(response.data, "binary");
//   return buffer.toString("base64");
// };
const convertImageToBase64 = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to convert image to base64");
  }
};
export const googleLogin = async (req, res) => {
  const { access_token } = req.body;

  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await response.json();
    const { email, name, picture } = data;

    let user = await User.findOne({ email });

    // Nếu chưa có user thì tạo mới
    if (!user) {
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(16).toString("hex"),
        12
      );

      // Convert avatar URL to base64
      const base64Avatar = await convertImageToBase64(picture);

      user = await User.create({
        fullName: name,
        email,
        avatar: `${base64Avatar}`,
        password: hashedPassword,
      });
    } else {
      // Nếu user đã tồn tại, cập nhật avatar mới nếu có thay đổi
      if (picture && user.avatar !== picture) {
        const base64Avatar = await convertImageToBase64(picture);
        user.avatar = `data:image/jpeg;base64,${base64Avatar}`;
        await user.save();
      }
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset password email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
