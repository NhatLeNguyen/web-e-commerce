import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

interface Order {
  tracking_no: string;
  name: string;
  quantity: number;
  status: number;
  email: string;
  orderTime: string;
  category: string;
  totalAmount: number;
}

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data as Order[];
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const fetchUserOrders = createAsyncThunk<
  Order[],
  { userId: string },
  { rejectValue: string }
>("orders/fetchUserOrders", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/orders/user/${userId}`);
    return response.data as Order[];
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
