import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { useDispatch } from "react-redux";
import categorySlice from "./products/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categorySlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
