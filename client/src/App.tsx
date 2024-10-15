import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/stores";
import { restoreUser, User } from "./redux/auth/authSlice";
import ReactGA from "react-ga";

const trackingId = "462461936";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user) as User;
      dispatch(restoreUser(parsedUser));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
