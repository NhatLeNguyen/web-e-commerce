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
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../../../hooks/useAuth";
import {
  listenToAllConversations,
  sendMessage,
  markMessagesAsRead,
} from "../../../../redux/chat/chatThunks";
import { AppDispatch, RootState } from "../../../../redux/stores";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";

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

const AdminChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error: chatError } = useSelector(
    (state: RootState) => state.chat
  );
  const { isAdmin, loading, user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      dispatch(listenToAllConversations());
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(markMessagesAsRead(selectedUserId));
    }
  }, [selectedUserId, dispatch]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return;

    const messageData: Omit<Message, "id"> = {
      text: input,
      sender: "admin",
      userId: null,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    try {
      await dispatch(
        sendMessage({ userId: selectedUserId, messageData })
      ).unwrap();
      setInput("");
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    }
  };

  const sortedUserIds = Object.keys(messages).sort((a, b) => {
    const hasUnreadA = messages[a].messages.some(
      (msg: Message) => msg.sender === "user" && !msg.isRead
    );
    const hasUnreadB = messages[b].messages.some(
      (msg: Message) => msg.sender === "user" && !msg.isRead
    );
    if (hasUnreadA && !hasUnreadB) return -1;
    if (!hasUnreadA && hasUnreadB) return 1;
    return 0;
  });

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
                {sortedUserIds.length > 0 ? (
                  sortedUserIds.map((userId) => {
                    const unreadCount = messages[userId].messages.filter(
                      (msg: Message) => msg.sender === "user" && !msg.isRead
                    ).length;
                    return (
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
                        <Badge
                          badgeContent={unreadCount}
                          color="error"
                          sx={{ mr: 2 }}
                        >
                          <Avatar
                            src={
                              messages[userId]?.avatar
                                ? `data:image/jpeg;base64,${messages[userId].avatar}`
                                : undefined
                            }
                            sx={{ bgcolor: "secondary.main" }}
                          >
                            {messages[userId]?.userName?.charAt(0) || "U"}
                          </Avatar>
                        </Badge>
                        <ListItemText
                          primary={messages[userId]?.userName || "Unknown User"}
                        />
                      </ListItem>
                    );
                  })
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
                    {messages[selectedUserId]?.messages?.length > 0 ? (
                      messages[selectedUserId].messages.map((msg: Message) => (
                        <Box
                          key={msg.id}
                          sx={{
                            display: "flex",
                            justifyContent:
                              msg.sender === "admin"
                                ? "flex-end"
                                : "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection:
                                msg.sender === "admin" ? "row-reverse" : "row",
                              alignItems: "center",
                              maxWidth: "70%",
                            }}
                          >
                            <Avatar
                              src={
                                msg.sender === "admin"
                                  ? user?.avatar
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : undefined
                                  : msg.avatar ||
                                    messages[selectedUserId]?.avatar
                                  ? `data:image/jpeg;base64,${
                                      msg.avatar ||
                                      messages[selectedUserId].avatar
                                    }`
                                  : undefined
                              }
                              sx={{
                                bgcolor:
                                  msg.sender === "admin"
                                    ? "primary.main"
                                    : "secondary.main",
                              }}
                            >
                              {msg.sender === "admin"
                                ? msg.adminName?.charAt(0) || "A"
                                : messages[selectedUserId]?.userName?.charAt(
                                    0
                                  ) || "U"}
                            </Avatar>
                            <Box
                              sx={{
                                ml: msg.sender === "admin" ? 0 : 1,
                                mr: msg.sender === "admin" ? 1 : 0,
                                p: 1,
                                borderRadius: 2,
                                bgcolor:
                                  msg.sender === "admin"
                                    ? "primary.main"
                                    : "grey.200",
                                color:
                                  msg.sender === "admin" ? "white" : "black",
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
                              <Typography variant="body2">
                                {msg.text}
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
