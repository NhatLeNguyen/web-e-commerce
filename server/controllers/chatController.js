import { db } from "../db/firebase.js";
import admin from "firebase-admin";

export const sendMessage = async (req, res) => {
  const { userId, message } = req.body;
  const senderId = req.user.id; // Lấy senderId từ token (middleware xác thực)

  try {
    // Tạo hoặc cập nhật cuộc trò chuyện
    const chatRef = db.collection("chats").doc(userId);
    const chatDoc = await chatRef.get();

    const newMessage = {
      senderId: senderId,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (chatDoc.exists) {
      // Nếu cuộc trò chuyện đã tồn tại, thêm tin nhắn mới vào array messages
      await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(newMessage),
      });
    } else {
      // Nếu chưa có cuộc trò chuyện, tạo mới
      await chatRef.set({
        userId,
        adminId: "admin", // ID của admin (cứng tạm thời, sẽ mở rộng sau)
        messages: [newMessage],
      });
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Lấy tin nhắn của một cuộc trò chuyện
export const getChatMessages = async (req, res) => {
  const userId = req.params.userId; // Lấy userId từ params
  const requesterId = req.user.id; // Lấy ID của người yêu cầu từ token

  try {
    // Kiểm tra quyền truy cập (dựa trên Firestore Security Rules)
    const chatRef = db.collection("chats").doc(userId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chatDoc.data());
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
