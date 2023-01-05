import axios from "axios";

import {API_SERVER} from "./constant";

const axiosInstance = axios.create({
  baseURL: API_SERVER,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.message.includes("Please try again") &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (err) {
        if (document?.location?.pathname !== "/authentication/sign-in") document.location.href = "/authentication/sign-in";
        return Promise.reject(error?.response?.data);
      }
    }

    return Promise.reject(error?.response?.data);
  },
);

export default axiosInstance;
