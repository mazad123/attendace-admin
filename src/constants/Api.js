import axios from "axios";
import { API_BASE_URL } from "../environment";

export const getAccessToken = () => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const tokenData = JSON.parse(tokens);
    return `${tokenData.access.token}`;
  }
  return null;
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  response => response,
  error => {
    const  getToken =  localStorage.getItem("tokens") ? JSON.parse(localStorage.getItem("tokens")) : null;
    const tokenExpirationTIme = !getToken ? null : getToken.refresh ? getToken.refresh.expires : getToken.access.expires;
    if (tokenExpirationTIme && (error.response.status === 421 || error.response.status === 307 || new Date() > new Date(tokenExpirationTIme)) || 
       (error.response.status === 401 && error.response.data.message === "Session expired, please login again" )) {
        setTimeout(() => {
          // Clear tokens and user data from localStorage
          localStorage.setItem('tokens', "");
          localStorage.setItem('user', "");

          // Redirect to the login page
          window.location.href = '/login';
        }, 700);
    }
    if(error.response.status=== 403){
      window.location.href = '/forbidden';
    }
    return Promise.reject(error);
});

