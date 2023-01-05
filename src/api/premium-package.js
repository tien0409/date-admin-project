import axios from "./index";
import { API_SERVER } from "config/constant";
import axiosInstance from "../config/axios";

class PremiumPackageApi {
  static GetAll = (params = {}, cancelToken) => {
    return axiosInstance.get(`${API_SERVER}/premium-packages`, { params, cancelToken });
  };

  static Create = (data) => {
    return axiosInstance.post(`${API_SERVER}/premium-packages`, data);
  };

  static Update = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/premium-packages/${id}`, data);
  };

  static UpdateStatus = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/premium-packages/status/${id}`, data);
  };

  static Delete = (id) => {
    return axiosInstance.delete(`${API_SERVER}/premium-packages/${id}`);
  };
}

export default PremiumPackageApi;
