import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders, fetchUserOrders, updateOrderStatus } from "./orderThunks";

interface Order {
  tracking_no: string;
  name: string;
  status: number;
  email: string;
  orderTime: string;
  totalAmount: number;
  paymentMethod: string;
}

interface OrdersState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user orders";
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const updatedOrder = action.payload;
          const existingOrder = state.orders.find(
            (order) => order.tracking_no === updatedOrder.tracking_no
          );
          if (existingOrder) {
            existingOrder.status = updatedOrder.status;
          }
        }
      );
  },
});

export default ordersSlice.reducer;
