import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface PaymentState {
  paymentUrl: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PaymentState = {
  paymentUrl: null,
  status: "idle",
  error: null,
};

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

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVNPayPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVNPayPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(createVNPayPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create payment";
      });
  },
});

export default paymentSlice.reducer;
