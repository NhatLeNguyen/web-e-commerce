import React from "react";
import Box from "@mui/material/Box";
import AppTheme from "../../themes/auth- themes/AuthTheme";
import DashboardSidebar from "./sidebar/AdminSidebar";
import Dashboard from "./dashboard/Dashboard";

const AdminPage: React.FC = () => {
  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <DashboardSidebar />
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Dashboard />
        </Box>
      </Box>
    </AppTheme>
  );
};

export default AdminPage;
