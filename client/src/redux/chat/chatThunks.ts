import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { RootState } from "../stores";

interface SendMessagePayload {
  userId: string;
  message: string;
}

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, message }: SendMessagePayload, { getState }) => {
    const state = getState() as RootState;
    const user =
      state.auth.user || JSON.parse(localStorage.getItem("user") || "{}");
    const senderId = user._id;

    const messageData = {
      senderId,
      message,
      timestamp: new Date().toISOString(),
    };

    const chatRef = collection(db, `chats/${userId}/messages`);
    await addDoc(chatRef, messageData);

    return { userId, messageData };
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (userId: string, { dispatch }) => {
    const chatRef = collection(db, `chats/${userId}/messages`);
    const q = query(chatRef, orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      dispatch({
        type: "chat/setMessages",
        payload: { userId, messages },
      });
    });

    return { userId, messages: [] };
  }
);

export const fetchAllConversations = createAsyncThunk(
  "chat/fetchAllConversations",
  async (userIds: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversations: { [key: string]: any } = {};
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    for (const userId of userIds) {
      const chatRef = collection(db, `chats/${userId}/messages`);
      const q = query(chatRef, orderBy("timestamp", "asc"));
      onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        conversations[userId] = {
          messages,
          userName:
            userId === userData._id ? userData.fullName : "User " + userId,
          avatar: userId === userData._id ? userData.avatar : undefined,
        };
      });
    }
    return conversations;
  }
);
