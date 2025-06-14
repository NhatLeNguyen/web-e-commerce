import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState } from "../../../../redux/stores";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/auth/authThunks";
import "./AppBar.scss";
import { AppDispatch } from "../../../../redux/stores";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "./cart-modal/cartModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useDispatch = () => useReduxDispatch<AppDispatch>();

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartModalOpen, setCartModalOpen] = React.useState(false);
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen(!open);
    if (subMenuOpen) setSubMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const handleCartClick = () => {
    setCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setCartModalOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
    setSubMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
    setOpen(false);
  };

  return (
    <header className="app-app-bar">
      <div className="container">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src="/images/logo.png" alt="e-commerce logo" className="logo" />
        </Link>
        <div className="toolbar">
          <div className="menu-items">
            <button className="menu-item" onClick={handleHomeClick}>
              Home
            </button>
            <div className="menu-item">
              Product
              <div className="sub-menu">
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/racket")}
                >
                  Racket
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/shoes")}
                >
                  Shoes
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/backpack")}
                >
                  Backpack
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/racket-bag")}
                >
                  Racket Bag
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/shorts")}
                >
                  Shorts
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/skirt")}
                >
                  Skirts
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/accessory")}
                >
                  Accessory
                </button>
              </div>
            </div>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/image-search")}
            >
              Image Search
            </button>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/contact")}
            >
              Contact Us
            </button>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/about-us")}
            >
              About Us
            </button>
          </div>
          <div className="user-actions">
            <div className="user-info">
              <div className="avatar" onClick={toggleMenu}>
                {user ? (
                  <img
                    src={
                      user.avatar
                        ? user.avatar.startsWith("data:image")
                          ? user.avatar
                          : user.avatar.startsWith("http")
                          ? user.avatar
                          : `data:image/jpeg;base64,${user.avatar}`
                        : "https://www.svgrepo.com/show/452030/avatar-default.svg"
                    }
                    alt="User Avatar"
                  />
                ) : (
                  <img
                    src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                    alt="Default Avatar"
                  />
                )}
              </div>
              <span>{user ? user.fullName : "Guest"}</span>
              {user && (
                <div className="cart-icon" onClick={handleCartClick}>
                  <ShoppingCartIcon />
                  <span className="cart-count">{cartItems.length}</span>
                </div>
              )}
              {menuOpen && user && (
                <div className="user-menu">
                  <ul>
                    <li onClick={() => navigate("/settings")}>
                      <SettingsIcon /> Settings
                    </li>
                    <li onClick={() => navigate("/orders-info")}>
                      <LocalShippingIcon /> Orders
                    </li>
                    <li onClick={handleLogout}>
                      <LogoutIcon /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {!user && (
              <>
                <button className="sign-in" onClick={handleSignIn}>
                  Sign in
                </button>
                <button className="sign-up" onClick={handleSignUp}>
                  Sign up
                </button>
              </>
            )}
          </div>
          <button className="menu-button" onClick={toggleDrawer}>
            ☰
          </button>
        </div>
      </div>

      <div className={`drawer-wrapper ${open ? "open" : ""}`}>
        <div className="drawer-overlay" onClick={toggleDrawer}></div>
        <div className="drawer">
          <button className="close-button" onClick={toggleDrawer}>
            ✕
          </button>
          <div className="drawer-menu-items">
            <button className="menu-item" onClick={handleHomeClick}>
              Home
            </button>
            <div className="menu-item">
              <button className="menu-item-toggle" onClick={toggleSubMenu}>
                Product
                <ExpandMoreIcon className={subMenuOpen ? "rotate" : ""} />
              </button>
              <div className={`sub-menu ${subMenuOpen ? "open" : ""}`}>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/racket")}
                >
                  Racket
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/shoes")}
                >
                  Shoes
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/backpack")}
                >
                  Backpack
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/racket-bag")}
                >
                  Racket Bag
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/shorts")}
                >
                  Shorts
                </button>
                <button
                  className="sub-menu-item"
                  onClick={() => handleNavigate("/product/skirts")}
                >
                  Skirts
                </button>
              </div>
            </div>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/image-search")}
            >
              Image Search
            </button>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/contact")}
            >
              Contact Us
            </button>
            <button
              className="menu-item"
              onClick={() => handleNavigate("/about-us")}
            >
              About Us
            </button>
            {!user && (
              <>
                <button className="menu-item sign-up" onClick={handleSignUp}>
                  Sign up
                </button>
                <button className="menu-item sign-in" onClick={handleSignIn}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <CartModal open={cartModalOpen} onClose={handleCloseCartModal} />
    </header>
  );
}
