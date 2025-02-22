import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

interface VNPayPaymentData {
  amount: number;
  bankCode: string;
  orderInfo: string;
}

interface VNPayResponse {
  paymentUrl: string;
}

export const createVNPayPayment = createAsyncThunk<
  VNPayResponse,
  VNPayPaymentData,
  { rejectValue: string }
>("payment/createVNPayPayment", async (paymentData, { rejectWithValue }) => {
  try {
    const amount = Math.round(paymentData.amount);

    const response = await axiosInstance.post<VNPayResponse>(
      "/create_payment/create-vnpay-payment",
      {
        ...paymentData,
        amount,
      }
    );
    if (!response.data.paymentUrl) {
      return rejectWithValue("Invalid payment URL received");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to create payment");
  }
});
