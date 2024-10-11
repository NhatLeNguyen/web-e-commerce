import React from "react";
import Box from "@mui/material/Box";
import AppTheme from "../../../themes/auth- themes/AuthTheme";
import DashboardSidebar from "../sidebar/AdminSidebar";
import ProductList from "./ProductList";
import { Typography } from "@mui/material";

const ProductManagementPage: React.FC = () => {
  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <DashboardSidebar />
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Products
          </Typography>
          <ProductList />
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ProductManagementPage;
