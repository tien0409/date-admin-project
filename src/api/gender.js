import axios from "./index";
import { API_SERVER } from "config/constant";

class GenderApi {
  static GetAll = () => {
    return axios.get(`${API_SERVER}/genders`);
  };

  static Create = (data) => {
    return axios.post(`${API_SERVER}/genders/create`, data);
  };
}

export default GenderApi;
