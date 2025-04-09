/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface ChatData {
  userId: string;
  adminId: string;
  messages: Message[];
}

interface ProcessedChatData {
  userName: string;
  avatar?: string;
  role: string;
  messages: Message[];
}

interface SendMessagePayload {
  userId: string;
  message: string;
}

interface SendMessageResponse {
  message: string;
}

// Gửi tin nhắn
export const sendMessage = createAsyncThunk<
  SendMessageResponse,
  SendMessagePayload,
  { rejectValue: string }
>(
  "chat/sendMessage",
  async ({ userId, message }: SendMessagePayload, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post<SendMessageResponse>(
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
        (error as any).response?.data?.message ||
        (error as Error).message ||
        "Failed to send message";
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy tin nhắn của một cuộc trò chuyện
export const fetchChatMessages = createAsyncThunk<
  { userId: string; data: ProcessedChatData }, // Kiểu trả về của fulfilled
  string, // Kiểu của tham số đầu vào (userId)
  { rejectValue: string } // Kiểu của rejectWithValue
>("chat/fetchChatMessages", async (userId: string, { rejectWithValue }) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axios.get<ChatData>(
      `https://web-e-commerce-xi.vercel.app/api/chat/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Xử lý dữ liệu để thêm userName, avatar, role
    const data: ProcessedChatData = {
      userName: "User Name", // Giả lập, cần lấy từ API user nếu có
      avatar: undefined, // Giả lập, cần lấy từ API user nếu có
      role: "guest", // Giả lập, cần lấy từ API user nếu có
      messages: response.data.messages || [],
    };

    return { userId, data };
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message ||
      (error as Error).message ||
      "Failed to fetch messages";
    return rejectWithValue(errorMessage);
  }
});

// Lấy danh sách tất cả cuộc trò chuyện (cho admin)
export const fetchAllConversations = createAsyncThunk<
  { [userId: string]: ProcessedChatData }, // Kiểu trả về của fulfilled
  string[], // Kiểu của tham số đầu vào (userIds)
  { rejectValue: string } // Kiểu của rejectWithValue
>(
  "chat/fetchAllConversations",
  async (userIds: string[], { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const allMessages: { [key: string]: ProcessedChatData } = {};

      // Gọi API để lấy tin nhắn của từng user
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const response = await axios.get<ChatData>(
              `https://web-e-commerce-xi.vercel.app/api/chat/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            allMessages[userId] = {
              userName: "User Name", // Giả lập, cần lấy từ API user nếu có
              avatar: undefined, // Giả lập, cần lấy từ API user nếu có
              role: "guest", // Giả lập, cần lấy từ API user nếu có
              messages: response.data.messages || [],
            };
          } catch (error) {
            console.error(`Error fetching messages for user ${userId}:`, error);
          }
        })
      );

      return allMessages;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as Error).message ||
        "Failed to fetch conversations";
      return rejectWithValue(errorMessage);
    }
  }
);
