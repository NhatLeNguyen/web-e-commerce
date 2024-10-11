import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "./productsSlice";

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    try {
      const response = await axios.get<Product[]>(
        "https://web-e-commerce-xi.vercel.app/api/products"
      );
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
);

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post<Product>(
        "https://web-e-commerce-xi.vercel.app/api/products",
        product
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
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
