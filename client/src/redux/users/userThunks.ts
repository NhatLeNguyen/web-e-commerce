import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { UserProfile } from "./userSlice";

const API_URL = "https://web-e-commerce-xi.vercel.app/api/user";

export const fetchUser = createAsyncThunk<UserProfile, string>(
  "user/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      const response = await axiosInstance.get<UserProfile>(`user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const fetchAllUsers = createAsyncThunk<UserProfile[]>(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      const response = await axiosInstance.get<UserProfile[]>(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
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
      `user/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to update user");
  }
});

export const updateUserInfo = createAsyncThunk<
  UserProfile,
  { userId: string; userData: Partial<UserProfile> }
>("user/updateUserInfo", async ({ userId, userData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const response = await axiosInstance.put<UserProfile>(
      `user/info/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to update user info");
  }
});

export const deleteUser = createAsyncThunk<void, string>(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      await axiosInstance.delete(`user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to delete user");
    }
  }
);

export const uploadAvatar = createAsyncThunk<
  UserProfile,
  { userId: string; formData: FormData }
>("user/uploadAvatar", async ({ userId, formData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const response = await axiosInstance.post<UserProfile>(
      `/avatar/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to upload avatar");
  }
});

// Add this to userThunks.js
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    {
      userId,
      oldPassword,
      newPassword,
    }: {
      userId: string;
      oldPassword: string;
      newPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post(
        `user/change-password`,
        { userId, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to change password");
    }
  }
);
