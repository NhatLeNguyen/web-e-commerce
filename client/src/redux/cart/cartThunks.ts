import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { CartItem, setCartItems } from "./cartSlice";

const API_URL = "https://web-e-commerce-xi.vercel.app/api/cart";

export const fetchCart = createAsyncThunk<CartItem[], { userId: string }>(
  "cart/fetchCart",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.get<CartItem[]>(
        `${API_URL}/${userId}`
      );
      dispatch(setCartItems(response.data));
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addItemToCart = createAsyncThunk<
  void,
  { userId: string; item: CartItem }
>("cart/addItemToCart", async ({ userId, item }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`${API_URL}/${userId}`, item);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to add item to cart");
  }
});

export const removeItemFromCart = createAsyncThunk<
  void,
  { userId: string; productId: string; size?: string }
>(
  "cart/removeItemFromCart",
  async ({ userId, productId, size }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL}/${userId}/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: { size },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to remove item from cart");
    }
  }
);
