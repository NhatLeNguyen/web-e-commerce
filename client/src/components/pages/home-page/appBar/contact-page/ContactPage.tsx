import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/stores";
import {
  sendMessage,
  fetchChatMessages,
} from "../../../../../redux/chat/chatThunks";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
}

const ContactPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    messages,
    error: chatError,
    loading,
  } = useSelector((state: RootState) => state.chat);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id as string | undefined;
  const isAdmin = user.role === "admin";
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin && userId) {
      dispatch(fetchChatMessages(userId)).catch((err) => {
        console.error("Error fetching messages in ContactPage:", err);
        setError("Failed to load messages. Please try again.");
      });
    }
  }, [dispatch, isAdmin, userId]);

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    try {
      await dispatch(sendMessage({ userId, message: input })).unwrap();
      setInput("");
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  if (isAdmin) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="textSecondary">
          Please use the Admin Chat page to manage conversations.
        </Typography>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="textSecondary">
          Please log in to use the chat feature.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 8 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Contact Us
      </Typography>
      <Paper
        elevation={3}
        sx={{ height: 400, overflowY: "auto", p: 2, mb: 2, bgcolor: "#f5f5f5" }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : messages[userId]?.messages?.length > 0 ? (
          messages[userId].messages.map((msg: Message) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.senderId === userId ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection:
                    msg.senderId === userId ? "row-reverse" : "row",
                  alignItems: "center",
                  maxWidth: "70%",
                }}
              >
                <Avatar
                  src={
                    msg.senderId === userId
                      ? user.avatar
                        ? `data:image/jpeg;base64,${user.avatar}`
                        : undefined
                      : undefined
                  }
                  sx={{
                    bgcolor:
                      msg.senderId === userId
                        ? "primary.main"
                        : "secondary.main",
                  }}
                >
                  {msg.senderId === userId
                    ? user.fullName?.charAt(0) || "U"
                    : "A"}
                </Avatar>
                <Box
                  sx={{
                    ml: msg.senderId === userId ? 0 : 1,
                    mr: msg.senderId === userId ? 1 : 0,
                    p: 1,
                    borderRadius: 2,
                    bgcolor:
                      msg.senderId === userId ? "primary.main" : "grey.200",
                    color: msg.senderId === userId ? "white" : "black",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      color: "text.secondary",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
            No messages yet.
          </Typography>
        )}
      </Paper>
      {(error || chatError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || chatError}
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ContactPage;
