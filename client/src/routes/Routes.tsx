import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../components/pages/home-page/HomePage";
import LoginPage from "../components/pages/login/Login";
import AdminPage from "../components/pages/admin-page/Admin";
import ProductList from "../components/pages/home-page/product-category/product-list/productList";
import RegisterPage from "../components/pages/register/Register";
import ProductDetail from "../components/pages/home-page/product-category/product-detail/productDetail";
import UserSettings from "../components/pages/home-page/setting-user/userSetting";
import UserManagementPage from "../components/pages/admin-page/users-management/UserManagement";
import ProductManagementPage from "../components/pages/admin-page/products-management/ProductManagement";
import { useSelector } from "react-redux";
import { RootState } from "../redux/stores";
import OrderManagement from "../components/pages/admin-page/orders-management/OrdersManagerment";
import OrderPage from "../components/pages/home-page/orders/OrderPage";
import OrdersInfo from "../components/pages/home-page/appBar/order-info/OrderInfo";
import VNPayReturn from "../components/pages/home-page/orders/VNPayReturn";

const AppRoutes: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const AdminRoute = ({ element }: { element: JSX.Element }) => {
    return currentUser?.role === "admin" ? element : <Navigate to="/login" />;
  };
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    return currentUser ? element : <Navigate to="/login" />;
  };
  return (
    <Routes>
      <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
      <Route
        path="/admin/users"
        element={<AdminRoute element={<UserManagementPage />} />}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute element={<ProductManagementPage />} />}
      />
      <Route
        path="/admin/orders"
        element={<AdminRoute element={<OrderManagement />} />}
      />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<UserSettings />} />
      <Route path="/product/:category" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/vnpay-return" element={<VNPayReturn />} />
      <Route
        path="/place-orders"
        element={<ProtectedRoute element={<OrderPage />} />}
      />
      <Route
        path="/orders-info"
        element={<ProtectedRoute element={<OrdersInfo />} />}
      />
    </Routes>
  );
};

export default AppRoutes;
