import React from "react";
import AppAppBar from "./appBar/AppBar";
import "./HomePage.scss";
import Banner from "./banner/Banner";
import ProductCategory from "./product-category/productCategory";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <AppAppBar />
      <Banner />
      <ProductCategory />
    </div>
  );
};

export default HomePage;
