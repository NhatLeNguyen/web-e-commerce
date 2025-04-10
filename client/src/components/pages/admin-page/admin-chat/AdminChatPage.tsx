import React, { useEffect, useRef, useState } from "react";
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
import {
  sendMessage,
  fetchAllConversations,
} from "../../../../redux/chat/chatThunks";
import { AppDispatch, RootState } from "../../../../redux/stores";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";

interface Message {
  id: string;
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isAdmin) {
      const promise = dispatch(fetchAllConversations());
      promise
        .unwrap()
        .then((result) => {
          cleanupRef.current = result.cleanup;
        })
        .catch((err) => {
          console.error("Error fetching conversations in AdminChatPage:", err);
          setError("Failed to load conversations. Please try again.");
        });

      return () => {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (selectedUserId) {
      const chatRef = collection(db, `chats/${selectedUserId}/messages`);
      const q = query(chatRef, orderBy("timestamp", "asc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({
            type: "chat/setMessages",
            payload: { userId: selectedUserId, messages },
          });
        },
        (err) => {
          console.error("Error fetching messages in AdminChatPage:", err);
          setError("Failed to load messages. Please try again.");
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, selectedUserId]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return;

    try {
      await dispatch(
        sendMessage({ userId: selectedUserId, message: input })
      ).unwrap();
      setInput("");
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

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
        <Box sx={{ flexGrow: 1, p: 3 }}>
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
              {(error || chatError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error || chatError}
                </Alert>
              )}
              <List>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : Object.keys(messages).length > 0 ? (
                  Object.keys(messages).map((userId) => (
                    <ListItem
                      key={userId}
                      onClick={() => {
                        setSelectedUserId(userId);
                      }}
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
                          key={msg.id}
                          sx={{
                            display: "flex",
                            justifyContent:
                              msg.senderId === user._id
                                ? "flex-end"
                                : "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection:
                                msg.senderId === user._id
                                  ? "row-reverse"
                                  : "row",
                              alignItems: "center",
                              maxWidth: "70%",
                            }}
                          >
                            <Avatar
                              src={
                                msg.senderId === user._id
                                  ? user.avatar
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : undefined
                                  : messages[selectedUserId]?.avatar
                                  ? `data:image/jpeg;base64,${messages[selectedUserId].avatar}`
                                  : undefined
                              }
                              sx={{
                                bgcolor:
                                  msg.senderId === user._id
                                    ? "primary.main"
                                    : "secondary.main",
                              }}
                            >
                              {msg.senderId === user._id
                                ? user.fullName?.charAt(0) || "A"
                                : messages[selectedUserId]?.userName?.charAt(
                                    0
                                  ) || "U"}
                            </Avatar>
                            <Box
                              sx={{
                                ml: msg.senderId === user._id ? 0 : 1,
                                mr: msg.senderId === user._id ? 1 : 0,
                                p: 1,
                                borderRadius: 2,
                                bgcolor:
                                  msg.senderId === user._id
                                    ? "primary.main"
                                    : "grey.200",
                                color:
                                  msg.senderId === user._id ? "white" : "black",
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
