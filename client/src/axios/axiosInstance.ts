import axios from "axios";
import store from "../redux/stores";
import { refreshAccessToken } from "../redux/auth/authThunks";

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
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Failed to refresh access token:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
