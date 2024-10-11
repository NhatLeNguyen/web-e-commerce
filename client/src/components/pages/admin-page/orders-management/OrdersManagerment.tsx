import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardSidebar from "../sidebar/AdminSidebar";
import OrderList from "./OrderList";

const OrderManagement: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
        <OrderList />
      </Box>
    </Box>
  );
};

export default OrderManagement;
