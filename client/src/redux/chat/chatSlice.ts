import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendMessage, markMessagesAsRead } from "./chatThunks";

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

interface ChatState {
  messages: {
    [userId: string]: {
      messages: Message[];
      userName: string;
      avatar?: string;
      role?: string;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{
        [userId: string]: {
          messages: Message[];
          userName: string;
          avatar?: string;
          role?: string;
        };
      }>
    ) => {
      state.messages = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ userId: string; message: Message }>
    ) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = {
          messages: [],
          userName: "Unknown User",
          role: "guest",
        };
      }
      state.messages[userId].messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { userId, messages } = action.payload;
        if (state.messages[userId]) {
          state.messages[userId].messages = messages;
        }
      });
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
