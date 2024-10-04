import { Box, Typography } from "@mui/material";
import DashboardSidebar from "../sidebar/AdminSidebar";

const OrderManagement: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderManagement;
