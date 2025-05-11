import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  refreshAccessToken,
  googleLogin,
  sendResetPasswordEmail,
  resetPassword,
} from "./authThunks";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  avatar: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          // localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        localStorage.removeItem("user");
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to refresh access token";
      })
      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        googleLogin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          // Đã dispatch setUser trong authThunks, không cần return action
        }
      )
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(sendResetPasswordEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendResetPasswordEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ?? "Failed to send reset password email";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to reset password";
      });
  },
});

export const { restoreUser } = authSlice.actions;
export default authSlice.reducer;
