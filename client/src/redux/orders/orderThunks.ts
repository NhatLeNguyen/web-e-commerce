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
  paymentMethod: string;
}

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data as Order[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: number },
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}`, {
        status,
      });
      return response.data as Order;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
