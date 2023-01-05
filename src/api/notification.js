import { API_SERVER } from "config/constant";
import axiosInstance from "../config/axios";

class NotificationApi {
  static GetAll = (params = {}, cancelToken) => {
    return axiosInstance.get(`${API_SERVER}/notifications`, { params, cancelToken });
  };

  static Create = (data) => {
    return axiosInstance.post(`${API_SERVER}/notifications`, data);
  };

  static Update = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/notifications/${id}`, data);
  };

  static UpdateActiveStatus = (id, data) => {
    return axiosInstance.patch(`${API_SERVER}/notifications/active/${id}`, data);
  };

  static UpdateInActiveStatus = (id, data) => {
    return axiosInstance.patch(`${API_SERVER}/notifications/in-active/${id}`, data);
  };

  static Delete = (id) => {
    return axiosInstance.delete(`${API_SERVER}/notifications/${id}`);
  };
}

export default NotificationApi;
