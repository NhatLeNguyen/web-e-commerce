import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/stores";
import { restoreUser, User } from "./redux/auth/authSlice";
import AppAppBar from "./components/pages/home-page/appBar/AppBar";

const Layout = () => {
  const location = useLocation();
  const hideAppBarPaths = ["/admin", "/login", "/register"];

  const shouldHideAppBar = hideAppBarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideAppBar && <AppAppBar />} <AppRoutes />
    </>
  );
};
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user) as User;
      dispatch(restoreUser(parsedUser));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
