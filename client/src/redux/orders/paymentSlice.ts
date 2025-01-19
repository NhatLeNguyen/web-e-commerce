import { createSlice } from "@reduxjs/toolkit";
import { createVNPayPayment } from "./paymentThunk";

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
