import axios from "axios";
import store from "../redux/stores";
import { refreshAccessToken } from "../redux/auth/authThunks";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

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
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
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
