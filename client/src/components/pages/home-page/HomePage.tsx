import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import Banner from "./banner/Banner";
import ProductCategory from "./product-category/productCategory";
import Footer from "./footer/Footer";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UserReviews from "./user-reviews/UserReviews";
import BrandLogos from "./brand-logo/BrandLogo";

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      <Banner />
      <ProductCategory />
      <BrandLogos />
      <UserReviews />
      <Footer />
      <button
        className={`back-to-top ${isVisible ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ExpandLessIcon />
      </button>
    </div>
  );
};

export default HomePage;
