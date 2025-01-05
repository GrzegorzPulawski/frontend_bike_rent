import axios from "axios";
import {jwtDecode} from "jwt-decode";

//axios.defaults.baseURL ="https://smart-ski-a8fba8950c38.herokuapp.com";
axios.defaults.baseURL ="https://backend-nakrawedzi-15a0f17618f3.herokuapp.com";
//axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers["Content-Type"] = 'application/json';

export const getAuthToken =() => {
    return window.localStorage.getItem("auth_token");
};
export const setAuthToken = (token) => {
     window.localStorage.setItem("auth_token", token);
};

export const getUserRole = (token) => {
    if (!token) { throw new Error("No token provided");
    } try { const decoded = jwtDecode(token);
        return decoded.role;
    } catch (error) { throw new Error("Invalid token specified: " + error.message); }
};
export const isUserInRole = (role) => {
    try { const token = getAuthToken();
        if (!token) { return false; }
        const userRole = getUserRole(token);
        return userRole === role;
    } catch (error) { console.error(error.message); return false; } };

export const request = (method, url, data) => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null"){
        headers = {"Authorization": `Bearer ${getAuthToken()}`};
    }
    return axios({
        method:method,
        headers: headers,
        url: url,
        data: data
    });
};

export default axios;
