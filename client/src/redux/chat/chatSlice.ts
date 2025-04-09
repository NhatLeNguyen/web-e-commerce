import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendMessage } from "./chatThunks";

// Cập nhật interface Message để khớp với dữ liệu từ API
interface Message {
  senderId: string; // ID của người gửi (userId hoặc adminId)
  message: string; // Nội dung tin nhắn
  timestamp: string; // Thời gian gửi
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
      });
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
