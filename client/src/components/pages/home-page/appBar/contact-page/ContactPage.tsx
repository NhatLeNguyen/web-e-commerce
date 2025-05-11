import React, { useEffect, useRef, useState } from "react";
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
import { addMessage } from "../../../../../redux/chat/chatSlice";
import "./ContactPage.scss";

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMessages = userId ? messages[userId]?.messages : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages]);

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
      const result = await dispatch(
        sendMessage({ userId, message: input })
      ).unwrap();

      dispatch(addMessage({ userId, message: result.messageData }));
      setInput("");
      setError(null);

      await dispatch(fetchChatMessages(userId)).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  if (isAdmin) {
    return (
      <Box className="admin-message-container">
        <Typography variant="h6" color="textSecondary">
          Please use the Admin Chat page to manage conversations.
        </Typography>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box className="login-message-container">
        <Typography variant="h6" color="textSecondary">
          Please log in to use the chat feature.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="contact-page-container">
      <header className="hero">
        <h1>Contact Us</h1>
        <p>We’re here to help!</p>
      </header>
      <Paper className="chat-paper">
        {loading ? (
          <Box className="loading-container">
            <CircularProgress />
          </Box>
        ) : currentMessages?.length > 0 ? (
          <>
            {currentMessages.map((msg: Message) => (
              <Box
                key={msg.id}
                className={`message-container ${
                  msg.senderId === userId ? "message-right" : "message-left"
                }`}
              >
                <Box className="message-content">
                  <Avatar
                    src={
                      msg.senderId === userId
                        ? user.avatar
                          ? `data:image/jpeg;base64,${user.avatar}`
                          : undefined
                        : undefined
                    }
                    className="message-avatar"
                  >
                    {msg.senderId === userId
                      ? user.fullName?.charAt(0) || "U"
                      : "A"}
                  </Avatar>
                  <Box
                    className={`message-bubble ${
                      msg.senderId === userId ? "bubble-user" : "bubble-admin"
                    }`}
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                    <Typography className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

            <div ref={messagesEndRef} />
          </>
        ) : (
          <Typography className="no-messages-text">No messages yet.</Typography>
        )}
      </Paper>
      {(error || chatError) && (
        <Alert severity="error" className="error-alert">
          {error || chatError}
        </Alert>
      )}
      <Box className="input-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="message-input"
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim()}
          className="send-button"
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ContactPage;
