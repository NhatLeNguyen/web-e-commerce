import { createSlice } from "@reduxjs/toolkit";
import {
  fetchChatMessages,
  sendMessage,
  fetchAllConversations,
} from "./chatThunks";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface ChatState {
  messages: {
    [userId: string]: {
      messages: Message[];
      userName?: string;
      avatar?: string;
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
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.messages[userId] = { ...state.messages[userId], messages };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, messageData } = action.payload;
        if (!state.messages[userId]) state.messages[userId] = { messages: [] };
        state.messages[userId].messages.push(messageData);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send message";
      })
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setMessages } = chatSlice.actions;
export default chatSlice.reducer;
