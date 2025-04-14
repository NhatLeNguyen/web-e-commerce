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
  isRead: boolean;
}

interface ChatState {
  messages: {
    [userId: string]: {
      messages: Message[];
      userName?: string;
      avatar?: string;
      hasUnread: boolean;
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
      const { userId, messages: newMessages } = action.payload;
      const currentMessages = state.messages[userId]?.messages || [];

      // Chỉ thêm những tin nhắn chưa có trong state (tránh trùng lặp)
      const updatedMessages = [...currentMessages];
      newMessages.forEach((newMsg) => {
        const exists = updatedMessages.some((msg) => msg.id === newMsg.id);
        if (!exists) {
          updatedMessages.push(newMsg);
        }
      });

      state.messages[userId] = {
        ...state.messages[userId],
        messages: updatedMessages,
      };
    },
    setConversations: (
      state,
      action: PayloadAction<{
        [userId: string]: {
          messages: Message[];
          userName?: string;
          avatar?: string;
          hasUnread: boolean;
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
          userName: "",
          avatar: "",
          hasUnread: false,
        };
      }
      // Kiểm tra xem tin nhắn đã tồn tại chưa trước khi thêm
      const exists = state.messages[userId].messages.some(
        (msg) => msg.id === message.id
      );
      if (!exists) {
        state.messages[userId].messages.push(message);
      }
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
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setMessages, setConversations, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
