import React from "react";
import AppAppBar from "../../components/appBar/AppBar";
import "./HomePage.scss";
import ProductGrid from "./product-grid/productGrid";
import Banner from "./banner/Banner";
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <AppAppBar />
      <Banner />
      <ProductGrid />
    </div>
  );
};

export default HomePage;
