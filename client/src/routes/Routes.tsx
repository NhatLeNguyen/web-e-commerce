import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/home-page/HomePage";
import LoginPage from "../components/pages/login/Login";
import AdminPage from "../components/pages/admin-page/Admin";
import ProductList from "../components/pages/home-page/product-category/product-list/productList";
import RegisterPage from "../components/pages/register/Register";
import ProductDetail from "../components/pages/home-page/product-category/product-detail/productDetail";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/product/:category" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default AppRoutes;
