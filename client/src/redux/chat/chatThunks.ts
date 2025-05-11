/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  Unsubscribe,
} from "firebase/firestore";
import { RootState } from "../stores";
import { db } from "../../firebase";

interface SendMessagePayload {
  userId: string;
  message: string;
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const sendMessage = createAsyncThunk<
  { userId: string; messageData: Message },
  SendMessagePayload,
  { rejectValue: string }
>(
  "chat/sendMessage",
  async ({ userId, message }: SendMessagePayload, { getState }) => {
    const state = getState() as RootState;
    const user =
      state.auth.user || JSON.parse(localStorage.getItem("user") || "{}");
    const senderId = user._id;

    if (user.role !== "admin" && userId !== senderId) {
      throw new Error(
        "You do not have permission to send messages to this user."
      );
    }

    const messageData = {
      senderId,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const chatRef = collection(db, `chats/${userId}/messages`);
    const docRef = await addDoc(chatRef, messageData);

    const messageWithId: Message = {
      id: docRef.id,
      senderId,
      message,
      timestamp: messageData.timestamp,
      isRead: false,
    };

    return { userId, messageData: messageWithId };
  }
);

export const fetchChatMessages = createAsyncThunk<
  { userId: string; messages: Message[] },
  string,
  { rejectValue: string }
>("chat/fetchChatMessages", async (userId: string, { dispatch, getState }) => {
  const state = getState() as RootState;
  const user =
    state.auth.user || JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "admin" && user._id !== userId) {
    throw new Error("You do not have permission to read these messages.");
  }

  const chatRef = collection(db, `chats/${userId}/messages`);
  const q = query(chatRef, orderBy("timestamp", "asc"));

  onSnapshot(
    q,
    (snapshot) => {
      const newMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        senderId: doc.data().senderId || "",
        message: doc.data().message || "",
        timestamp: doc.data().timestamp || "",
        isRead: doc.data().isRead || false,
      }));

      dispatch({
        type: "chat/setMessages",
        payload: { userId, messages: newMessages },
      });
    },
    (error) => {
      console.error(`Error fetching messages for user ${userId}:`, error);
      throw error;
    }
  );

  return { userId, messages: [] };
});

export const fetchAllConversations = createAsyncThunk<
  { cleanup: () => void },
  void,
  { rejectValue: string }
>(
  "chat/fetchAllConversations",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user =
        state.auth.user || JSON.parse(localStorage.getItem("user") || "{}");

      if (user.role !== "admin") {
        throw new Error(
          "You do not have permission to fetch all conversations."
        );
      }

      const usersRef = collection(db, "users");
      const conversations: {
        [key: string]: {
          messages: Message[];
          userName?: string;
          avatar?: string;
          hasUnread: boolean;
          role?: string;
        };
      } = {};
      const userListeners: Unsubscribe[] = [];

      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const userId = change.doc.id;
          const userData = change.doc.data();

          if (userData.role !== "guest") {
            return;
          }

          if (change.type === "added") {
            if (!conversations[userId]) {
              conversations[userId] = {
                messages: [],
                userName: userData.fullName || `User ${userId}`,
                avatar: userData.avatar || undefined,
                hasUnread: false,
                role: userData.role || "guest",
              };

              const chatRef = collection(db, `chats/${userId}/messages`);
              const q = query(chatRef, orderBy("timestamp", "asc"));

              const chatUnsubscribe = onSnapshot(
                q,
                (chatSnapshot) => {
                  const newMessages: Message[] = chatSnapshot.docs.map(
                    (doc) => ({
                      id: doc.id,
                      senderId: doc.data().senderId || "",
                      message: doc.data().message || "",
                      timestamp: doc.data().timestamp || "",
                      isRead: doc.data().isRead || false,
                    })
                  );

                  const hasUnread = newMessages.some(
                    (msg) => msg.senderId !== user._id && !msg.isRead
                  );

                  conversations[userId] = {
                    ...conversations[userId],
                    messages: newMessages,
                    hasUnread,
                  };

                  const filteredConversations = Object.fromEntries(
                    Object.entries(conversations).filter(
                      ([_, conv]) => conv.messages.length > 0
                    )
                  );

                  dispatch({
                    type: "chat/setConversations",
                    payload: filteredConversations,
                  });
                },
                (error) => {
                  console.error(
                    `Error fetching messages for user ${userId}:`,
                    error
                  );
                }
              );

              userListeners.push(chatUnsubscribe);
            }
          } else if (change.type === "modified") {
            if (conversations[userId]) {
              conversations[userId] = {
                ...conversations[userId],
                userName: userData.fullName || `User ${userId}`,
                avatar: userData.avatar || undefined,
                role: userData.role || "guest",
              };

              const filteredConversations = Object.fromEntries(
                Object.entries(conversations).filter(
                  ([_, conv]) => conv.messages.length > 0
                )
              );

              dispatch({
                type: "chat/setConversations",
                payload: filteredConversations,
              });
            }
          } else if (change.type === "removed") {
            delete conversations[userId];

            const filteredConversations = Object.fromEntries(
              Object.entries(conversations).filter(
                ([_, conv]) => conv.messages.length > 0
              )
            );

            dispatch({
              type: "chat/setConversations",
              payload: filteredConversations,
            });
          }
        });
      });

      userListeners.push(unsubscribe);

      return {
        cleanup: () => {
          userListeners.forEach((unsubscribe) => unsubscribe());
          console.log("Unsubscribed from all user listeners");
        },
      };
    } catch (error) {
      console.error("Error fetching all conversations:", error);
      return rejectWithValue(
        (error as Error).message || "Failed to fetch conversations"
      );
    }
  }
);
