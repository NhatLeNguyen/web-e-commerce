import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createVNPayPayment = createAsyncThunk(
  "payment/createVNPayPayment",
  async (paymentData: {
    orderId: string;
    amount: number;
    bankCode: string;
  }) => {
    const response = await axios.post<{ paymentUrl: string }>(
      "/api/create_payment",
      paymentData
    );
    return { paymentUrl: response.data.paymentUrl };
  }
);
