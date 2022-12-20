import axios from "./index";
import { API_SERVER } from "config/constant";

class GenderApi {
  static GetAll = () => {
    return axios.get(`${API_SERVER}/genders/admin`);
  };
}

export default GenderApi;
