import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/stores";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppTheme from "../../themes/auth- themes/AuthTheme";

const AdminPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AppTheme>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to the admin dashboard. Here you can manage the application.
        </Typography>
      </Box>
    </AppTheme>
  );
};

export default AdminPage;
