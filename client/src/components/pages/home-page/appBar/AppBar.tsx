import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState } from "../../../../redux/stores";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/auth/authThunks";
import "./AppBar.scss";
import { AppDispatch } from "../../../../redux/stores";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "./cart-modal/cartModal";
import { useEffect } from "react";

const useDispatch = () => useReduxDispatch<AppDispatch>();

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartModalOpen, setCartModalOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  const toggleDrawer = () => {
    setOpen(!open);
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

  const handleCartClick = () => {
    setCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setCartModalOpen(false);
  };

  return (
    <header className="app-app-bar">
      <div className="container">
        <div className="toolbar">
          <div className="menu-items">
            <button className="menu-item">Features</button>
            <button className="menu-item">Testimonials</button>
            <button className="menu-item">Highlights</button>
            <button className="menu-item">Pricing</button>
            <button className="menu-item">FAQ</button>
            <button className="menu-item">Blog</button>
          </div>
          <div className="user-actions">
            <div className="user-info">
              <div className="avatar" onClick={toggleMenu}>
                {user ? (
                  <img
                    src={
                      user.avatar ||
                      "https://www.svgrepo.com/show/452030/avatar-default.svg"
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
        {open && (
          <div className="drawer">
            <button className="close-button" onClick={toggleDrawer}>
              ✕
            </button>
            <div className="drawer-menu-items">
              <button className="menu-item">Features</button>
              <button className="menu-item">Testimonials</button>
              <button className="menu-item">Highlights</button>
              <button className="menu-item">Pricing</button>
              <button className="menu-item">FAQ</button>
              <button className="menu-item">Blog</button>
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
        )}
      </div>
      <CartModal open={cartModalOpen} onClose={handleCloseCartModal} />
    </header>
  );
}