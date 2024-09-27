import React, { useEffect } from "react";
import AppAppBar from "./appBar/AppBar";
import "./HomePage.scss";
import Banner from "./banner/Banner";
import ProductCategory from "./product-category/productCategory";
import { useDispatch } from "react-redux";
import { restoreUser } from "../../../redux/auth/authSlice";
import { jwtDecode } from "jwt-decode";
const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        dispatch(restoreUser(jwtDecode(token)));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dispatch]);

  return (
    <div className="home-page">
      <AppAppBar />
      <Banner />
      <ProductCategory />
    </div>
  );
};

export default HomePage;
