import express from "express";

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({ message: "Chat service is running" });
});

export default router;
