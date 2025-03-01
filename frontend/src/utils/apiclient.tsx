import axios from 'axios';

const BASE_URL= "http://127.0.0.1:3000/user";

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,    });

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    console.log("aaaaaaaa",token)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
