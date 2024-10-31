import { Router } from "express";
import { sendMessageToHuggingFace } from "../controllers/chatController.js";
const router = Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  const context =
    "You are a helpful assistant for an e-commerce website specializing in badminton equipment.";

  try {
    const response = await sendMessageToHuggingFace(message, context);
    res.json({ response });
  } catch (error) {
    console.error("Error sending message to Hugging Face:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
