import React from "react";
import AppAppBar from "./appBar/AppBar";
import "./HomePage.scss";
import Banner from "./banner/Banner";
import ProductCategory from "./product-category/productCategory";
import ChatBot from "react-chatbotify";
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <AppAppBar />
      <Banner />
      <ProductCategory />
      <ChatBot />
    </div>
  );
};

export default HomePage;
