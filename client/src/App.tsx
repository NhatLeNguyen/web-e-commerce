import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/login/Login";
import RegisterPage from "./components/pages/register/Register";
import HomePage from "./components/pages/home-page/Home";
import AdminPage from "./components/pages/admin-page/Admin";
import ProductList from "./components/pages/home-page/product-category/productList";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/product/:category" element={<ProductList />} />
      </Routes>
    </Router>
  );
};

export default App;
