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
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import {
  sendMessage,
  fetchAllConversations,
} from "../../../../redux/chat/chatThunks";
import { AppDispatch, RootState } from "../../../../redux/stores";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { addMessage, setConversations } from "../../../../redux/chat/chatSlice";

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMessages = selectedUserId
    ? messages[selectedUserId]?.messages
    : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (selectedUserId) {
      const chatRef = collection(db, `chats/${selectedUserId}/messages`);
      const q = query(chatRef, orderBy("timestamp", "asc"));
      unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            senderId: doc.data().senderId || "",
            message: doc.data().message || "",
            timestamp: doc.data().timestamp || "",
            isRead: doc.data().isRead || false,
          }));

          const updates = snapshot.docs
            .filter(
              (doc) => doc.data().senderId !== user._id && !doc.data().isRead
            )
            .map((doc) =>
              updateDoc(doc.ref, { isRead: true }).catch((err) =>
                console.error(`Error marking message ${doc.id} as read:`, err)
              )
            );
          await Promise.all(updates);

          dispatch({
            type: "chat/setMessages",
            payload: { userId: selectedUserId, messages: newMessages },
          });

          const hasUnread = newMessages.some(
            (msg) => msg.senderId !== user._id && !msg.isRead
          );
          const updatedConversations = {
            ...messages,
            [selectedUserId]: {
              ...messages[selectedUserId],
              messages: newMessages,
              hasUnread,
            },
          };
          dispatch(setConversations(updatedConversations));
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
  }, [dispatch, selectedUserId, user._id, messages]);

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

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return;

    try {
      const result = await dispatch(
        sendMessage({ userId: selectedUserId, message: input })
      ).unwrap();

      dispatch(
        addMessage({ userId: selectedUserId, message: result.messageData })
      );
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
              sx={{ width: "30%", p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
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
                  Object.keys(messages).map((userId, index) => (
                    <React.Fragment key={userId}>
                      <ListItem
                        onClick={() => {
                          setSelectedUserId(userId);
                        }}
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          bgcolor:
                            selectedUserId === userId
                              ? "#e3f2fd"
                              : "transparent",
                          "&:hover": { bgcolor: "#eceff1" },
                          py: 0.5,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!messages[userId]?.hasUnread}
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
                          primaryTypographyProps={{
                            fontWeight: messages[userId]?.hasUnread
                              ? "bold"
                              : "normal",
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                      {index < Object.keys(messages).length - 1 && (
                        <Divider sx={{ my: 0.5, bgcolor: "#e0e0e0" }} />
                      )}
                    </React.Fragment>
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
                    ) : currentMessages?.length > 0 ? (
                      <>
                        {currentMessages.map((msg: Message) => {
                          const isAdminMessage =
                            msg.senderId === user._id ||
                            (msg.senderId !== selectedUserId &&
                              messages[selectedUserId]?.role !== "admin");

                          return (
                            <Box
                              key={msg.id}
                              sx={{
                                display: "flex",
                                justifyContent: isAdminMessage
                                  ? "flex-end"
                                  : "flex-start",
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: isAdminMessage
                                    ? "row-reverse"
                                    : "row",
                                  alignItems: "center",
                                  maxWidth: "70%",
                                }}
                              >
                                <Avatar
                                  src={
                                    isAdminMessage
                                      ? user.avatar
                                        ? `data:image/jpeg;base64,${user.avatar}`
                                        : undefined
                                      : messages[selectedUserId]?.avatar
                                      ? `data:image/jpeg;base64,${messages[selectedUserId].avatar}`
                                      : undefined
                                  }
                                  sx={{
                                    bgcolor: isAdminMessage
                                      ? "primary.main"
                                      : "secondary.main",
                                  }}
                                >
                                  {isAdminMessage
                                    ? user.fullName?.charAt(0) || "A"
                                    : messages[
                                        selectedUserId
                                      ]?.userName?.charAt(0) || "U"}
                                </Avatar>
                                <Box
                                  sx={{
                                    ml: isAdminMessage ? 0 : 1,
                                    mr: isAdminMessage ? 1 : 0,
                                    p: 1,
                                    borderRadius: 2,
                                    bgcolor: isAdminMessage
                                      ? "primary.main"
                                      : "grey.200",
                                    color: isAdminMessage ? "white" : "black",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    {msg.message}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        textAlign: "right",
                                        color: "text.secondary",
                                      }}
                                    >
                                      {new Date(
                                        msg.timestamp
                                      ).toLocaleTimeString()}
                                    </Typography>
                                    {msg.isRead && !isAdminMessage && (
                                      <DoneIcon
                                        sx={{ fontSize: 14, color: "green" }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
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
