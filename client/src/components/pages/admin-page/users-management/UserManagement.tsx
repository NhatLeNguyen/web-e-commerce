import React from "react";
import Box from "@mui/material/Box";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";
import UserList from "./UserList";
import { Typography } from "@mui/material";

const UserManagementPage: React.FC = () => {
  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <DashboardSidebar />
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Users
          </Typography>
          <UserList />
        </Box>
      </Box>
    </AppTheme>
  );
};

export default UserManagementPage;
