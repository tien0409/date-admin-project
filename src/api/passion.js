import axios from "./index";
import { API_SERVER } from "config/constant";
import axiosInstance from "../config/axios";

class PassionApi {
  static GetAll = (params = {}, cancelToken) => {
    return axiosInstance.get(`${API_SERVER}/passions`, { params, cancelToken });
  };

  static Create = (data) => {
    return axiosInstance.post(`${API_SERVER}/passions`, data);
  };

  static Update = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/passions/${id}`, data);
  };

  static Delete = (id) => {
    return axiosInstance.delete(`${API_SERVER}/passions/${id}`);
  };
}

export default PassionApi;
