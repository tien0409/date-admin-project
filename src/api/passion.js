import axios from "./index";
import { API_SERVER } from "config/constant";

class PassionApi {
  static GetAll = (params = {}, cancelToken) => {
    return axios.get(`${API_SERVER}/passions`, { params, cancelToken });
  };

  static Create = (data) => {
    return axios.post(`${API_SERVER}/passions`, data);
  };

  static Update = (id, data) => {
    return axios.put(`${API_SERVER}/passions/${id}`, data);
  };

  static Delete = (id) => {
    return axios.delete(`${API_SERVER}/passions/${id}`);
  };
}

export default PassionApi;
