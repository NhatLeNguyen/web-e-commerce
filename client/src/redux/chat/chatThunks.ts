import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
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
}

interface SendMessagePayload {
  userId: string;
  messageData: Omit<Message, "id">;
}

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, messageData }: SendMessagePayload, { getState }) => {
    const state = getState() as RootState;
    const userName =
      messageData.sender === "admin"
        ? state.chat.messages[userId]?.userName || "Unknown User"
        : state.auth.user?.fullName || "Unknown User";
    const avatar =
      messageData.sender === "admin"
        ? state.auth.user?.avatar
        : state.auth.user?.avatar;
    const messageId = new Date().toISOString();
    const message: Message = {
      ...messageData,
      id: messageId,
      userName,
      avatar,
      isRead: messageData.sender === "admin",
    };

    const userChatRef = doc(db, "chats", userId);
    const currentMessages = state.chat.messages[userId]?.messages || [];
    await setDoc(
      userChatRef,
      {
        userName, // Luôn cập nhật userName từ localStorage
        avatar, // Luôn cập nhật avatar từ localStorage
        messages: [...currentMessages, message],
      },
      { merge: true }
    );

    return { userId, message };
  }
);

export const listenToAllConversations = createAsyncThunk(
  "chat/listenToAllConversations",
  async (_, { dispatch }) => {
    const chatsRef = collection(db, "chats");
    onSnapshot(chatsRef, (snapshot) => {
      const allMessages: {
        [key: string]: {
          userName: string;
          avatar?: string;
          messages: Message[];
        };
      } = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        allMessages[doc.id] = {
          userName: data.userName || "Unknown User",
          avatar: data.avatar,
          messages: data.messages || [],
        };
      });
      dispatch({ type: "chat/setMessages", payload: allMessages });
    });
  }
);

export const listenToMessages = createAsyncThunk(
  "chat/listenToMessages",
  async (userId: string, { dispatch }) => {
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
              messages: data.messages || [],
            },
          },
        });
      }
    });
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (userId: string, { getState }) => {
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
  }
);
