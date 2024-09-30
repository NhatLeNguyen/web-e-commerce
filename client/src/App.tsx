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
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const decodedUser = jwtDecode<User>(token);
        const parsedUser = JSON.parse(user) as User;

        if (decodedUser.id === parsedUser.id) {
          dispatch(restoreUser(parsedUser));
        } else {
          console.error(
            "User information mismatch between token and localStorage"
          );
        }
      } catch (error) {
        console.error(
          "Invalid token or failed to parse user from localStorage:",
          error
        );
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
