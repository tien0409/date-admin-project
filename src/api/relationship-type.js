import axios from "./index";
import { API_SERVER } from "config/constant";

class RelationshipTypeApi {
  static GetAll = (params = {}, cancelToken) => {
    return axios.get(`${API_SERVER}/relationship-types`, { params, cancelToken });
  };

  static Create = (data) => {
    return axios.post(`${API_SERVER}/relationship-types/create`, data);
  };

  static Update = (id, data) => {
    return axios.put(`${API_SERVER}/relationship-types/${id}`, data);
  };

  static Delete = (id) => {
    return axios.delete(`${API_SERVER}/relationship-types/${id}`);
  };
}

export default RelationshipTypeApi;
