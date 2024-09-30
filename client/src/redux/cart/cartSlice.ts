import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size?: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          item.productId !== action.payload.productId ||
          item.size !== action.payload.size
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
