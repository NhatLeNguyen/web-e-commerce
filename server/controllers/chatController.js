import { db } from "../db/firebase.js";
import admin from "firebase-admin";

export const sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: "userId and message are required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or missing user authentication",
    });
  }

  const senderId = req.user.id;

  try {
    const chatRef = db.collection("chats").doc(userId);
    const chatDoc = await chatRef.get();

    const newMessage = {
      senderId: senderId,
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (chatDoc.exists) {
      await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(newMessage),
      });
    } else {
      await chatRef.set({
        userId: userId,
        adminId: "admin",
        messages: [newMessage],
      });
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or missing user authentication",
    });
  }

  const requesterId = req.user.id;

  try {
    const chatRef = db.collection("chats").doc(userId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chatDoc.data());
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res
      .status(500)
      .json({ message: "Failed to get chat messages", error: error.message });
  }
};
