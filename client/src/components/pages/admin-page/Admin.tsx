import React from "react";
import Box from "@mui/material/Box";
import AppTheme from "../../themes/auth- themes/AuthTheme";
import DashboardSidebar from "./sidebar/AdminSidebar";
import Dashboard from "./dashboard/Dashboard";
import { CssBaseline } from "@mui/material";
import ColorModeSelect from "../../themes/auth- themes/ColorModeSelect";

const AdminPage: React.FC = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
          <ColorModeSelect />
        </Box>
        <DashboardSidebar />
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Dashboard />
        </Box>
      </Box>
    </AppTheme>
  );
};

export default AdminPage;
