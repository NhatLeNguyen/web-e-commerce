import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllConversations,
  fetchChatMessages,
  sendMessage,
} from "./chatThunks";

interface Message {
  id: string;
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
    setMessages: (
      state,
      action: PayloadAction<{ userId: string; messages: Message[] }>
    ) => {
      const { userId, messages } = action.payload;
      state.messages[userId] = {
        ...state.messages[userId],
        messages,
      };
    },
    setConversations: (
      state,
      action: PayloadAction<{
        [userId: string]: {
          messages: Message[];
          userName?: string;
          avatar?: string;
        };
      }>
    ) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConversations.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      .addCase(fetchChatMessages.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMessages, setConversations } = chatSlice.actions;
export default chatSlice.reducer;
