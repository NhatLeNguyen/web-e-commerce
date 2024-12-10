import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await axios.get("/api/orders");
  return response.data;
});

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId: string) => {
    const response = await axios.get(`/api/orders/user/${userId}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }: { orderId: string; status: number }) => {
    const response = await axios.patch(`/api/orders/${orderId}`, { status });
    return response.data;
  }
);
