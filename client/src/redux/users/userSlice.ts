import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUser,
  fetchAllUsers,
  updateUser,
  uploadAvatar,
  deleteUser,
  updateUserInfo,
  changePassword,
} from "./userThunks";

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserState {
  user: UserProfile | null;
  items: UserProfile[];
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  items: [],
  accessToken: localStorage.getItem("accessToken"),
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    reset: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      state.items = [];
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.status = "succeeded";
          state.user = action.payload;
          state.error = null;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<UserProfile[]>) => {
          state.items = action.payload;
        }
      )
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          if (
            state.user?._id === action.payload._id &&
            state.user.role !== action.payload.role
          ) {
            console.warn("Users cannot change their own role.");
            return;
          }

          if (state.user?._id === action.payload._id) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
          } else {
            state.items = state.items.map((user) =>
              user._id === action.payload._id ? action.payload : user
            );
          }
        }
      )
      .addCase(updateUserInfo.pending, (state) => {
        // Fixed the typo and syntax here
        state.status = "loading";
      })
      .addCase(
        updateUserInfo.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.status = "succeeded";
          if (state.user?._id === action.payload._id) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
          } else {
            state.items = state.items.map((user) =>
              user._id === action.payload._id ? action.payload : user
            );
          }
        }
      )
      .addCase(
        uploadAvatar.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          if (state.user?._id === action.payload._id) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
          } else {
            state.items = state.items.map((user) =>
              user._id === action.payload._id ? action.payload : user
            );
          }
        }
      )
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        state.error = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, reset } = userSlice.actions;
export default userSlice.reducer;
