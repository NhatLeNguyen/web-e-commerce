// cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
}

interface CartState {
  userId: string | null;
  items: CartItem[];
}

const initialState: CartState = {
  userId: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
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
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setUserId, addItem, removeItem, clearCart, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
