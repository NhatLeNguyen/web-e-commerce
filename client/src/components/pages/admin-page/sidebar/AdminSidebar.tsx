import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/stores";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../redux/stores";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReceiptIcon from "@mui/icons-material/Receipt"; // Import biểu tượng cho Orders
import { logout } from "../../../../redux/auth/authThunks";
import "./AdminSidebar.scss";

const AdminSidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,

        [`& .MuiDrawer-paper`]: {
          width: 260,
          boxSizing: "border-box",
          backgroundColor: "#B8E5F63B",
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Avatar
          alt={user?.fullName}
          src={
            user?.avatar
              ? `data:image/jpeg;base64,${user.avatar}`
              : "https://www.svgrepo.com/show/452030/avatar-default.svg"
          }
          sx={{ width: 56, height: 56, margin: "auto" }}
        />
        <Typography variant="h6">{user?.fullName}</Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/admin")}
            className={location.pathname === "/admin" ? "active" : ""}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/admin/users")}
            className={location.pathname === "/admin/users" ? "active" : ""}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/admin/products")}
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/admin/orders")}
            className={location.pathname === "/admin/orders" ? "active" : ""}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/admin/settings")}
            className={location.pathname === "/admin/settings" ? "active" : ""}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
