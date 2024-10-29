import axios from "axios";
import store from "../redux/stores";
import { refreshAccessToken } from "../redux/auth/authThunks";
import { logout } from "../redux/auth/authThunks";

const axiosInstance = axios.create({
  baseURL: "https://web-e-commerce-xi.vercel.app/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const action = await store.dispatch(refreshAccessToken());
        if (refreshAccessToken.fulfilled.match(action)) {
          const newAccessToken = action.payload as string;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        await store.dispatch(logout());
        window.location.href = "/login"; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
