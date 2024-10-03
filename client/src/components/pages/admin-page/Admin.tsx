import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppTheme from "../../themes/auth- themes/AuthTheme";
import DashboardSidebar from "./sidebar/AdminSidebar";

const AdminPage: React.FC = () => {
  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <DashboardSidebar />
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default AdminPage;
