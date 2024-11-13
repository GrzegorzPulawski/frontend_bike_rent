import axios from "axios";

axios.defaults.baseURL ="https://smart-ski-a8fba8950c38.herokuapp.com";
axios.defaults.headers["Content-Type"] = 'application/json';

export const getAuthToken =() => {
    return window.localStorage.getItem("auth_token");
};
export const setAuthToken = (token) => {
     window.localStorage.setItem("auth_token", token);
};
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