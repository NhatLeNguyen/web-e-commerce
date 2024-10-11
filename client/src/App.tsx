import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/stores";
import { restoreUser, User } from "./redux/auth/authSlice";
import axios from "axios";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user) as User;
      dispatch(restoreUser(parsedUser));
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://web-e-commerce-server.vercel.app/`
        );
        console.log("Data from backend:", response.data);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
