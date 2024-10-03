import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "./productsSlice";

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    try {
      const response = await axios.get<Product[]>("/api/products");
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
);
export const updateProduct = createAsyncThunk<Product, Product>(
  "products/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.put<Product>(
        `/api/products/${product._id}`,
        product
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk<void, string>(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to delete product");
    }
  }
);
