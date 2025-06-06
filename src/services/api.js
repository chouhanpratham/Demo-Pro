import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://edusyncprathambackend.azurewebsites.net/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Making request with config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return Promise.reject(error);
  }
);

export default api;
