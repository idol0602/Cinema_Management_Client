import axios from 'axios';
import type { AxiosInstance } from 'axios';
import qs from 'qs';

const api : AxiosInstance  = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      allowDots: true,
      encode: false,
      arrayFormat: 'comma',
    }),
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'Request error',
      statusCode: error.response?.status || 500,
      error: error.response?.data,
    };
  }
  return {
    message: 'Unknown error',
    statusCode: 500,
    error,
  };
};

export default api;
