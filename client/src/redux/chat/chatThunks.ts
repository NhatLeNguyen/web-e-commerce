import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface SendMessagePayload {
  userId: string;
  message: string;
}

// Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, message }: SendMessagePayload, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        "https://web-e-commerce-xi.vercel.app/api/chat/send",
        { userId, message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy tin nhắn của một cuộc trò chuyện
export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (userId: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `https://web-e-commerce-xi.vercel.app/api/chat/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return { userId, data: response.data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch messages";
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy danh sách tất cả cuộc trò chuyện (cho admin)
export const fetchAllConversations = createAsyncThunk(
  "chat/fetchAllConversations",
  async (userIds: string[], { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const allMessages: {
        [key: string]: {
          userName: string;
          avatar?: string;
          messages: Message[];
          role?: string;
        };
      } = {};

      // Gọi API để lấy tin nhắn của từng user
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const response = await axios.get(
              `https://web-e-commerce-xi.vercel.app/api/chat/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const data = response.data as {
              userName?: string;
              avatar?: string;
              role?: string;
              messages?: Message[];
            };
            allMessages[userId] = {
              userName: data.userName || "Unknown User",
              avatar: data.avatar,
              role: data.role || "guest",
              messages: data.messages || [],
            };
          } catch (error) {
            console.error(`Error fetching messages for user ${userId}:`, error);
          }
        })
      );

      return allMessages;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch conversations";
      return rejectWithValue(errorMessage);
    }
  }
);
