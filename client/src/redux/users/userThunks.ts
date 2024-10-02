import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { UserProfile } from "./userSlice";

const API_URL = "http://localhost:5000/api/user";

export const fetchUser = createAsyncThunk<UserProfile, string>(
  "user/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      const response = await axiosInstance.get<UserProfile>(
        `${API_URL}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const updateUser = createAsyncThunk<
  UserProfile,
  { userId: string; userData: Partial<UserProfile> }
>("user/updateUser", async ({ userId, userData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const response = await axiosInstance.put<UserProfile>(
      `${API_URL}/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to update user");
  }
});

export const uploadAvatar = createAsyncThunk<
  UserProfile,
  { userId: string; formData: FormData }
>("user/uploadAvatar", async ({ userId, formData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const response = await axiosInstance.post<UserProfile>(
      `${API_URL}/${userId}/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to upload avatar");
  }
});
