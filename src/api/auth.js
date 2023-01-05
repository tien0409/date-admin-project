import {API_SERVER} from "config/constant";
import axiosInstance from "../config/axios";

class AuthApi {
    static Login = (data) => {
        return axiosInstance.post(`${API_SERVER}/auth/signin`, data);
    };

    static Auth = () => {
        return axiosInstance.get(`${API_SERVER}/auth/user-auth`);
    };

    static Register = (data) => {
        return axiosInstance.post(`${API_SERVER}users/register`, data);
    };

    static Authorize = (code) => {
        return axiosInstance.get(`${API_SERVER}sessions/oauth/github?code=${code}`);
    };

    static Logout = (data) => {
        return axiosInstance.post(`${API_SERVER}users/logout`, data, {
            headers: {Authorization: `${data.token}`},
        });
    };
}

export default AuthApi;
