import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productsThunk";

export interface RacketDetails {
  flexibility: string;
  frameMaterial: string;
  shaftMaterial: string;
  weight: string;
  gripSize: string;
  maxTension: string;
  balancePoint: string;
  color: string;
  madeIn: string;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  size?: string;
  racketDetails?: RacketDetails;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    updateProductState: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(
        (product) => product._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.items.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product._id !== action.meta.arg
        );
      });
  },
});

export const { setProducts, updateProductState } = productsSlice.actions;
export default productsSlice.reducer;
