import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import { useAuth } from "../../../../hooks/useAuth";
import {
  listenToMessages,
  sendMessage,
} from "../../../../redux/chat/chatThunks";
import { AppDispatch, RootState } from "../../../../redux/stores";

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

const ContactPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.chat);
  const { userId, isAdmin, loading, user } = useAuth();
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin && userId) {
      dispatch(listenToMessages(userId));
    }
  }, [dispatch, isAdmin, userId]);

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const messageData: Omit<Message, "id"> = {
      text: input,
      sender: isAdmin ? "admin" : "user",
      userId: isAdmin ? null : userId,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      await dispatch(sendMessage({ userId, messageData })).unwrap();
      setInput("");
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        {messages[userId]?.messages?.length > 0 ? (
          messages[userId].messages.map((msg: Message) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "center",
                  maxWidth: "70%",
                }}
              >
                <Avatar
                  src={
                    msg.sender === "user"
                      ? user?.avatar
                        ? `data:image/jpeg;base64,${user.avatar}`
                        : undefined
                      : msg.avatar || messages[userId]?.avatar
                      ? `data:image/jpeg;base64,${
                          msg.avatar || messages[userId].avatar
                        }`
                      : undefined
                  }
                  sx={{
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "secondary.main",
                  }}
                >
                  {msg.sender === "user"
                    ? user?.fullName?.charAt(0) || "U"
                    : msg.adminName?.charAt(0) || "A"}
                </Avatar>
                <Box
                  sx={{
                    ml: msg.sender === "user" ? 0 : 1,
                    mr: msg.sender === "user" ? 1 : 0,
                    p: 1,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "grey.200",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.sender === "admin" && msg.adminName && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", fontWeight: "bold" }}
                    >
                      {msg.adminName}
                    </Typography>
                  )}
                  <Typography variant="body2">{msg.text}</Typography>
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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
