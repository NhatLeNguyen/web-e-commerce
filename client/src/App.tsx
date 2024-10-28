import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/stores";
import { jwtDecode } from "jwt-decode";
import { restoreUser, User } from "./redux/auth/authSlice";
import { refreshAccessToken } from "./redux/auth/authThunks";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [, setIsTokenRefreshed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      console.log("Initial access token:", token);

      try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          dispatch(refreshAccessToken())
            .then((action) => {
              if (refreshAccessToken.fulfilled.match(action)) {
                const newAccessToken = action.payload as string;
                localStorage.setItem("accessToken", newAccessToken);
                console.log("Refreshed access token:", newAccessToken);
                const parsedUser = JSON.parse(user) as User;
                dispatch(restoreUser(parsedUser));
                setIsTokenRefreshed(true);
              } else {
                console.error("Failed to refresh access token:", action.error);
              }
            })
            .catch((error) => {
              console.error("Failed to refresh access token:", error);
            });
        } else {
          const parsedUser = JSON.parse(user) as User;
          dispatch(restoreUser(parsedUser));
          setIsTokenRefreshed(true);
        }
      } catch (error) {
        console.error(
          "Invalid token or failed to parse user from localStorage:",
          error
        );
      }
    } else {
      setIsTokenRefreshed(true);
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
