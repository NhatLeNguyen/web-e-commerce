import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { AuthResponse } from "./authSlice";
import { fetchUser } from "../users/userThunks";

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      `auth/login`,
      credentials
    );
    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    await dispatch(fetchUser(user._id)).unwrap();

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const googleLogin = createAsyncThunk<
  AuthResponse,
  { access_token: string }
>(
  "auth/googleLogin",
  async ({ access_token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `auth/google-login`,
        { access_token }
      );
      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch fetchUser to update the user slice
      await dispatch(fetchUser(user._id)).unwrap();

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk<
  AuthResponse,
  { fullName: string; email: string; password: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(`auth/register`, {
      ...credentials,
      role: "guest",
    });
    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    dispatch({ type: "user/reset" });
    return null;
  }
);

export const refreshAccessToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ accessToken: string }>(
      `auth/refresh-token`,
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to refresh access token");
  }
});

// export const googleLogin = createAsyncThunk<
//   AuthResponse,
//   { access_token: string }
// >("auth/googleLogin", async ({ access_token }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post<AuthResponse>(
//       `auth/google-login`,
//       { access_token }
//     );
//     const { accessToken, user } = response.data;

//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("user", JSON.stringify(user));
//     return response.data;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });

export const sendResetPasswordEmail = createAsyncThunk<void, { email: string }>(
  "auth/sendResetPasswordEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      await axiosInstance.post("auth/forgot-password", { email });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk<
  void,
  { token: string; password: string }
>("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`auth/reset-password/${token}`, { password });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
