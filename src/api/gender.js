import axios from "./index";
import { API_SERVER } from "config/constant";

class GenderApi {
  static GetAll = (params = {}, cancelToken) => {
    return axios.get(`${API_SERVER}/genders`, { params, cancelToken });
  };

  static Create = (data) => {
    return axios.post(`${API_SERVER}/genders/create`, data);
  };

  static Update = (id, data) => {
    return axios.put(`${API_SERVER}/genders/${id}`, data);
  };

  static Delete = (id) => {
    return axios.delete(`${API_SERVER}/genders/${id}`);
  };
}

export default GenderApi;
