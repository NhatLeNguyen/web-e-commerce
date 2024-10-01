import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItem, setCartItems } from "./cartSlice";

const API_URL = "http://localhost:5000/api/cart";

export const fetchCart = createAsyncThunk<
  CartItem[],
  { userId: string; token: string }
>(
  "cart/fetchCart",
  async ({ userId, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get<CartItem[]>(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCartItems(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addItemToCart = createAsyncThunk<
  void,
  { userId: string; item: CartItem; token: string }
>(
  "cart/addItemToCart",
  async ({ userId, item, token }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/${userId}`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

export const removeItemFromCart = createAsyncThunk<
  void,
  { userId: string; productId: string; size?: string; token: string }
>(
  "cart/removeItemFromCart",
  async ({ userId, productId, size, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${userId}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { size },
      });
    } catch (error) {
      return rejectWithValue("Failed to remove item from cart");
    }
  }
);
