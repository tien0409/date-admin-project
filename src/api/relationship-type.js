import { API_SERVER } from "config/constant";
import axiosInstance from "../config/axios";

class RelationshipTypeApi {
  static GetAll = (params = {}, cancelToken) => {
    return axiosInstance.get(`${API_SERVER}/relationship-types`, { params, cancelToken });
  };

  static Create = (data) => {
    return axiosInstance.post(`${API_SERVER}/relationship-types/create`, data);
  };

  static Update = (id, data) => {
    return axiosInstance.put(`${API_SERVER}/relationship-types/${id}`, data);
  };

  static Delete = (id) => {
    return axiosInstance.delete(`${API_SERVER}/relationship-types/${id}`);
  };
}

export default RelationshipTypeApi;
