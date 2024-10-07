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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token found");
    }
    const response = await axiosInstance.get("/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as Order[];
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      // Return the error message from the response
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
