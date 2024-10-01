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
