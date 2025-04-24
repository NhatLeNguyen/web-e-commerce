import { useEffect, useRef, useState } from "react";
import {
  LocalShipping,
  Security,
  LocalOffer,
  CreditCard,
} from "@mui/icons-material";
import "./Services.scss";

const servicesData = [
  {
    id: 1,
    icon: <LocalShipping fontSize="large" />,
    title: "Express Delivery",
    info: "Ships in 24 Hours",
  },
  {
    id: 2,
    icon: <Security fontSize="large" />,
    title: "Brand Warranty",
    info: "100% Original products",
  },
  {
    id: 3,
    icon: <LocalOffer fontSize="large" />,
    title: "Exciting Deals",
    info: "On all prepaid orders",
  },
  {
    id: 4,
    icon: <CreditCard fontSize="large" />,
    title: "Secure Payments",
    info: "SSL / Secure certificate",
  },
];

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`Services_section ${isVisible ? "fade-in" : ""}`}
      ref={sectionRef}
    >
      <div className="Services_wrapper">
        {servicesData.map((item) => (
          <div className="Services_card glass-card" key={item.id}>
            <div className="Services_icon">{item.icon}</div>
            <div>
              <div className="Services_cardTitle gradient-text">
                {item.title}
              </div>
              <div className="Services_cardInfo">{item.info}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
