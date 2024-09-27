import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register, logout } from "./authThunks";

export interface User {
  id: string;
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
  user: null,
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
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { restoreUser } = authSlice.actions;
export default authSlice.reducer;
