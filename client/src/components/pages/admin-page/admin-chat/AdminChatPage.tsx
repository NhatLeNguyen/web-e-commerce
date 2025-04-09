import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../../../hooks/useAuth";
import {
  sendMessage,
  fetchChatMessages,
  fetchAllConversations,
} from "../../../../redux/chat/chatThunks";
import { AppDispatch, RootState } from "../../../../redux/stores";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

const AdminChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    messages,
    error: chatError,
    loading,
  } = useSelector((state: RootState) => state.chat);
  const { isAdmin, user, loading: authLoading } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách tất cả cuộc trò chuyện khi component mount
  useEffect(() => {
    if (isAdmin) {
      const userIds = Object.keys(messages);
      dispatch(fetchAllConversations(userIds));
    }
  }, [dispatch, isAdmin, messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return;

    const message = input;
    try {
      await dispatch(sendMessage({ userId: selectedUserId, message })).unwrap();
      setInput("");
      setError(null);
      // Lấy lại tin nhắn sau khi gửi
      dispatch(fetchChatMessages(selectedUserId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    }
  };

  if (authLoading) {
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

  if (!isAdmin) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3, textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="textSecondary">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <DashboardSidebar />
        <Box sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 0, md: "240px" } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "left" }}
          >
            Chat
          </Typography>
          <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", gap: 2 }}>
            <Paper
              elevation={3}
              sx={{ width: "30%", p: 2, bgcolor: "#f5f5f5" }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Conversations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {Object.keys(messages).length > 0 ? (
                  Object.keys(messages).map((userId) => (
                    <ListItem
                      key={userId}
                      onClick={() => setSelectedUserId(userId)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 1,
                        bgcolor:
                          selectedUserId === userId
                            ? "primary.light"
                            : "transparent",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <Avatar
                        src={
                          messages[userId]?.avatar
                            ? `data:image/jpeg;base64,${messages[userId].avatar}`
                            : undefined
                        }
                        sx={{ bgcolor: "secondary.main", mr: 2 }}
                      >
                        {messages[userId]?.userName?.charAt(0) || "U"}
                      </Avatar>
                      <ListItemText
                        primary={messages[userId]?.userName || "Unknown User"}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ p: 2 }}
                  >
                    No conversations available.
                  </Typography>
                )}
              </List>
            </Paper>

            <Box sx={{ width: "70%" }}>
              {selectedUserId && messages[selectedUserId] ? (
                <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Chat with{" "}
                    {messages[selectedUserId]?.userName || "Unknown User"}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400, overflowY: "auto", mb: 2 }}>
                    {loading ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", p: 2 }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : messages[selectedUserId]?.messages?.length > 0 ? (
                      messages[selectedUserId].messages.map((msg: Message) => (
                        <Box
                          key={msg.timestamp}
                          sx={{
                            display: "flex",
                            justifyContent:
                              msg.senderId === user?._id
                                ? "flex-end"
                                : "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection:
                                msg.senderId === user?._id
                                  ? "row-reverse"
                                  : "row",
                              alignItems: "center",
                              maxWidth: "70%",
                            }}
                          >
                            <Avatar
                              src={
                                msg.senderId === user?._id
                                  ? user?.avatar
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : undefined
                                  : messages[selectedUserId]?.avatar
                                  ? `data:image/jpeg;base64,${messages[selectedUserId].avatar}`
                                  : undefined
                              }
                              sx={{
                                bgcolor:
                                  msg.senderId === user?._id
                                    ? "primary.main"
                                    : "secondary.main",
                              }}
                            >
                              {msg.senderId === user?._id
                                ? user?.fullName?.charAt(0) || "A"
                                : messages[selectedUserId]?.userName?.charAt(
                                    0
                                  ) || "U"}
                            </Avatar>
                            <Box
                              sx={{
                                ml: msg.senderId === user?._id ? 0 : 1,
                                mr: msg.senderId === user?._id ? 1 : 0,
                                p: 1,
                                borderRadius: 2,
                                bgcolor:
                                  msg.senderId === user?._id
                                    ? "primary.main"
                                    : "grey.200",
                                color:
                                  msg.senderId === user?._id
                                    ? "white"
                                    : "black",
                              }}
                            >
                              <Typography variant="body2">
                                {msg.message}
                              </Typography>
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
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ p: 2 }}
                      >
                        No messages yet.
                      </Typography>
                    )}
                  </Box>
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
                </Paper>
              ) : (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6" color="textSecondary">
                    Select a user to start chatting
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default AdminChatPage;
