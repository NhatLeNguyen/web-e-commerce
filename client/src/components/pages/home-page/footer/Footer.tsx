import React, { useState } from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Footer.scss";
import Services from "./Services";

const footMenu = [
  {
    id: 1,
    title: "Help",
    menu: [
      { id: 1, link: "Track Order", path: "/" },
      { id: 2, link: "FAQs", path: "/" },
      { id: 3, link: "Cancel Order", path: "/" },
      { id: 4, link: "Return Order", path: "/" },
      { id: 5, link: "Warranty Info", path: "/" },
    ],
  },
  {
    id: 2,
    title: "Policies",
    menu: [
      { id: 1, link: "Return Policy", path: "/" },
      { id: 2, link: "Security", path: "/" },
      { id: 3, link: "Sitemap", path: "/" },
      { id: 4, link: "Privacy Policy", path: "/" },
      { id: 5, link: "T&C", path: "/" },
    ],
  },
  {
    id: 3,
    title: "Company",
    menu: [
      { id: 1, link: "About Us", path: "/" },
      { id: 2, link: "Contact Us", path: "/" },
      { id: 3, link: "Service Centres", path: "/" },
      { id: 4, link: "Careers", path: "/" },
      { id: 5, link: "Affiliates", path: "/" },
    ],
  },
];

const footSocial = [
  {
    id: 1,
    icon: <FacebookIcon className="facebook_icon" fontSize="large" />,
    path: "https://www.instagram.com/iam_nightbot/",
  },
  {
    id: 2,
    icon: <TwitterIcon className="twitter_icon" fontSize="large" />,
    path: "https://twitter.com/Iam_DEv22",
  },
  {
    id: 3,
    icon: <InstagramIcon className="insta_icon" fontSize="large" />,
    path: "https://www.instagram.com/cricket_weapon_store17",
  },
  {
    id: 4,
    icon: <LinkedInIcon className="linkedin_icon" fontSize="large" />,
    path: "https://www.linkedin.com/in/iam-devesh/",
  },
];

const Footer = () => {
  const [subValue, setSubValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubValue("");
    alert("Thank you, you are subscribed to receive our daily newsletter");
  };

  const currYear = new Date().getFullYear();

  return (
    <div>
      <Services />
      <footer className="footer">
        <div className="container">
          <div className="footer-wrapper">
            <div className="footer-about">
              <div className="footer-logo">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img src="/images/logo.png" alt="e-commerce logo" />
                </Link>
              </div>

              <div className="footer-subs">
                <h5>Newslatter</h5>
                <form onSubmit={handleSubmit} className="footer-form">
                  <input
                    type="email"
                    className="input-field-footer"
                    placeholder="Email Address*"
                    required
                    value={subValue}
                    onChange={(e) => setSubValue(e.target.value)}
                  />
                  <p>
                    By submitting your email address you agree to the{" "}
                    <Link to="/" className="footer-subs-text">
                      Terms & Conditions
                    </Link>
                  </p>
                  <button type="submit" className="btn-footer">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="footer-menu-container">
              {footMenu.map((item) => {
                const { id, title, menu } = item;
                return (
                  <div className="footer-menu" key={id}>
                    <h4>{title}</h4>
                    <ul>
                      {menu.map((item) => {
                        const { id, link, path } = item;
                        return (
                          <li key={id}>
                            <Link to={path}>{link}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="footer-links">
              <div className="footer-download-app-link">
                <h5>Download app</h5>
                <div className="app-links">
                  <span className="google-play-store-link">
                    <a href="/">
                      {/* <img src={GooglePlay} alt="play Store svg" /> */}
                    </a>
                  </span>
                  <span className="apple-store-link">
                    <a href="/">
                      {/* <img src={AppStore} alt="Apple Store svg" /> */}
                    </a>
                  </span>
                </div>
              </div>

              <div className="footer-social">
                {footSocial.map((item) => {
                  const { id, icon, path } = item;
                  return (
                    <a
                      href={path}
                      key={id}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="separator-footer"></div>

        <div className="sub-footer-root">
          <div className="container-footer">
            <div className="sub-footer-wrapper">
              <div className="footer-policy-link">
                <ul>
                  <li className="subfoot-link-text1">
                    <Link to="/">
                      <p className="footer-policy-link-p">Privacy Policy</p>
                    </Link>
                  </li>
                  <li className="subfoot-link-text2">
                    <Link to="/">
                      <p className="footer-policy-link-p">TERMS & CONDITIONS</p>
                    </Link>
                  </li>
                  <li className="subfoot-link-text3">
                    <Link to="/">
                      <p className="footer-policy-link-p">TERMS OF USE</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="footer-copyright">
                <p>
                  &copy; {currYear} | E-commerce, All Rights Reserved.
                  <span>
                    <a href="https://github.com/NhatLeNguyen">
                      | Built by nhatlenguyen
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
