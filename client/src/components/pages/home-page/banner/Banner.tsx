import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.scss";

const Banner: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "85vh",
    objectFit: "cover",
  };

  return (
    <div>
      <Slider {...settings} className="banner-container">
        <div>
          <img
            className="banner"
            src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/astrox88-sd-key-visual-2880x1120-_1718650445.webp"
            alt="banner1"
            style={imageStyle}
          />
          <div className="lineBanner"></div>
        </div>
        <div>
          <img
            className="banner"
            src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/thiet-ke-chua-co-ten-12_1727137763.webp"
            alt="banner1"
            style={imageStyle}
          />
          <div className="lineBanner"></div>
        </div>{" "}
        <div>
          <img
            className="banner"
            src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/65z3ltd-launch-website_1695177820.webp"
            alt="banner1"
            style={imageStyle}
          />
          <div className="lineBanner"></div>
        </div>
        <div>
          <img
            className="banner"
            src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/ynx-eclp-banner_1695178004.webp"
            alt="banner2"
            style={imageStyle}
          />
          <div className="lineBanner"></div>
        </div>
        <div>
          <img
            className="banner"
            src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/1000z-launch-website-banner_1695177885.webp"
            alt="banner3"
            style={imageStyle}
          />
          <div className="lineBanner"></div>
        </div>
      </Slider>
    </div>
  );
};

export default Banner;
