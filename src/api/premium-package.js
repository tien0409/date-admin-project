import axios from "./index";
import { API_SERVER } from "config/constant";

class PremiumPackageApi {
  static GetAll = (params = {}, cancelToken) => {
    return axios.get(`${API_SERVER}/premium-packages`, { params, cancelToken });
  };

  static Create = (data) => {
    return axios.post(`${API_SERVER}/premium-packages`, data);
  };

  static Update = (id, data) => {
    return axios.put(`${API_SERVER}/premium-packages/${id}`, data);
  };

  static UpdateStatus = (id, data) => {
    return axios.put(`${API_SERVER}/premium-packages/status/${id}`, data);
  };

  static Delete = (id) => {
    return axios.delete(`${API_SERVER}/premium-packages/${id}`);
  };
}

export default PremiumPackageApi;
