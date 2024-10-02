import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser, updateUser, uploadAvatar } from "./userThunks";

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(
        uploadAvatar.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
