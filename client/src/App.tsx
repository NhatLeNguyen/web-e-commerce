import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { restoreUser, User } from "./redux/auth/authSlice";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token) as User;
        dispatch(restoreUser(decodedUser));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
