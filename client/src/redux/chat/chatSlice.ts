import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  sendMessage,
  fetchChatMessages,
  fetchAllConversations,
} from "./chatThunks";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface ProcessedChatData {
  userName: string;
  avatar?: string;
  role: string;
  messages: Message[];
}

interface ChatState {
  messages: {
    [userId: string]: ProcessedChatData;
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
        [userId: string]: ProcessedChatData;
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
          userName: "Unknown User",
          role: "guest",
          messages: [],
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
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatMessages.fulfilled,
        (
          state,
          action: PayloadAction<{ userId: string; data: ProcessedChatData }>
        ) => {
          state.loading = false;
          const { userId, data } = action.payload;
          state.messages[userId] = data;
        }
      )
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
