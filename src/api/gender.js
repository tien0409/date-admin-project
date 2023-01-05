import { API_SERVER } from "config/constant";
import axiosInstance from "../config/axios";

class GenderApi {
  static GetAll = (params = {}, cancelToken) => {
    return axiosInstance.get(`${API_SERVER}/genders`, { params, cancelToken });
  };

  static Create = (data) => {
    return axiosInstance.post(`${API_SERVER}/genders/create`, data);
  };

  static Update = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/genders/${id}`, data);
  };

  static Delete = (id) => {
    return axiosInstance.delete(`${API_SERVER}/genders/${id}`);
  };
}

export default GenderApi;
