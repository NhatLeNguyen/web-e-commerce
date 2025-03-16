import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { useDispatch } from "react-redux";
import categorySlice from "./products/categorySlice";
import cartReducer from "./cart/cartSlice";
import productsReducer from "./products/productsSlice";
import userReducer from "./users/userSlice";
import orderReducer from "./orders/orderSlice";
import paymentReducer from "./orders/paymentSlice";
import reviewReducer from "./reviews/reviewSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categorySlice,
    cart: cartReducer,
    products: productsReducer,
    user: userReducer,
    orders: orderReducer,
    payment: paymentReducer,
    reviews: reviewReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
