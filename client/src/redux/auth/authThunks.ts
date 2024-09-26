import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "./authSlice";

const API_URL = "http://localhost:5000/api/auth";

export const login = createAsyncThunk<
  User,
  { email: string; password: string }
>("auth/login", async (credentials) => {
  const response = await axios.post<User>(`${API_URL}/login`, credentials);
  return response.data;
});

export const register = createAsyncThunk<
  User,
  { fullName: string; email: string; password: string; role: string }
>("auth/register", async (credentials) => {
  const response = await axios.post<User>(`${API_URL}/register`, credentials);
  return response.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  return null;
});
