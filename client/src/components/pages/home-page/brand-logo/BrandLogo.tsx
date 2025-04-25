import React from "react";
import "./BrandLogo.scss";

const brandLogos = [
  { name: "Yonex", logo: "/images/yonex.png", className: "yonex" },
  { name: "Li-Ning", logo: "./images/lining.png", className: "lining" },
  { name: "Mizuno", logo: "./images/mizuno.png", className: "mizuno" },
  { name: "Victor", logo: "./images/victor.png", className: "victor" },
  { name: "Fly Power", logo: "./images/Flypower.png", className: "flypower" },
];

const BrandLogos: React.FC = () => {
  return (
    <div className="brand-logos-wrapper">
      <div className="brand-logos">
        {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, index) => (
          <img
            key={index}
            src={brand.logo}
            alt={brand.name}
            className={`brand-logo ${brand.className || ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandLogos;
