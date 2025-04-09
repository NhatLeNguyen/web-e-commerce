import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { RootState } from "../stores";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  userId: string | null;
  timestamp: string;
  userName?: string;
  avatar?: string;
  isRead: boolean;
  adminId?: string;
  adminName?: string;
}

interface SendMessagePayload {
  userId: string;
  messageData: Omit<Message, "id">;
}

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { userId, messageData }: SendMessagePayload,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const userName =
        messageData.sender === "admin"
          ? state.chat.messages[userId]?.userName || "Unknown User"
          : state.auth.user?.fullName || "Unknown User";
      const avatar =
        messageData.sender === "admin"
          ? state.auth.user?.avatar
          : state.auth.user?.avatar;
      const role =
        messageData.sender === "admin"
          ? "admin"
          : state.auth.user?.role || "guest";
      const adminId =
        messageData.sender === "admin" ? state.auth.user?._id : undefined;
      const adminName =
        messageData.sender === "admin" ? state.auth.user?.fullName : undefined;
      const messageId = new Date().toISOString();
      const message: Message = {
        ...messageData,
        id: messageId,
        userName,
        avatar,
        isRead: messageData.sender === "admin",
        adminId,
        adminName,
      };

      const userChatRef = doc(db, "chats", userId);
      await runTransaction(db, async (transaction) => {
        const userChatDoc = await transaction.get(userChatRef);
        const currentMessages = userChatDoc.exists()
          ? userChatDoc.data().messages || []
          : [];
        transaction.set(
          userChatRef,
          {
            userId,
            userName,
            avatar,
            role,
            messages: [...currentMessages, message],
          },
          { merge: true }
        );
      });

      return { userId, message };
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return rejectWithValue(
        (error instanceof Error ? error.message : "An unknown error occurred") ||
          "Failed to send message. Please check your permissions or try again."
      );
    }
  }
);

export const listenToAllConversations = createAsyncThunk(
  "chat/listenToAllConversations",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const chatsRef = collection(db, "chats");
      onSnapshot(chatsRef, (snapshot) => {
        const allMessages: {
          [key: string]: {
            userName: string;
            avatar?: string;
            messages: Message[];
            role?: string;
          };
        } = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          allMessages[doc.id] = {
            userName: data.userName || "Unknown User",
            avatar: data.avatar,
            role: data.role || "guest",
            messages: data.messages || [],
          };
        });
        dispatch({ type: "chat/setMessages", payload: allMessages });
      });
    } catch (error) {
      return rejectWithValue(
        (error instanceof Error ? error.message : "An unknown error occurred") || "Failed to listen to conversations"
      );
    }
  }
);

export const listenToMessages = createAsyncThunk(
  "chat/listenToMessages",
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      const userChatRef = doc(db, "chats", userId);
      onSnapshot(userChatRef, (doc) => {
        const data = doc.data();
        if (data) {
          dispatch({
            type: "chat/setMessages",
            payload: {
              [userId]: {
                userName: data.userName || "Unknown User",
                avatar: data.avatar,
                role: data.role || "guest",
                messages: data.messages || [],
              },
            },
          });
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to listen to messages";
      return rejectWithValue(errorMessage);
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const messages = state.chat.messages[userId]?.messages || [];
      const updatedMessages = messages.map((msg: Message) =>
        msg.sender === "user" && !msg.isRead ? { ...msg, isRead: true } : msg
      );

      const userChatRef = doc(db, "chats", userId);
      await updateDoc(userChatRef, {
        messages: updatedMessages,
      });

      return { userId, messages: updatedMessages };
    } catch (error) {
      return rejectWithValue(
        (error instanceof Error ? error.message : "An unknown error occurred") || "Failed to mark messages as read"
      );
    }
  }
);
