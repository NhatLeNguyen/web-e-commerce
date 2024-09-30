import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthResponse } from "./authSlice";

const API_URL = "http://localhost:5000/api/auth";

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/login`,
      credentials
    );
    const { accessToken, user } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  { fullName: string; email: string; password: string; role: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/register`,
      credentials
    );
    const { accessToken, user } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  return null;
});

export const refreshAccessToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ accessToken: string }>(
      `${API_URL}/refresh-token`,
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return rejectWithValue("Failed to refresh access token");
  }
});
