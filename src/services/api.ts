import axios from 'axios';
import type { AxiosInstance } from 'axios';
import qs from 'qs';

const isProduction = process.env.NODE_ENV === 'production';
const isBrowser = typeof window !== 'undefined';

const api : AxiosInstance  = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 50000, // 50s - Render free tier có cold start lên đến 30s
  headers: {
    'Content-Type': 'application/json',
    // Only add ngrok header for development (ngrok requires this to skip browser warning)
    ...(isProduction ? {} : { 'ngrok-skip-browser-warning': 'true' }),
  },
  withCredentials: isBrowser, // Chỉ gửi cookies khi ở browser, SSR (server) không cần
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
      // Chỉ redirect ở browser, không redirect trên server (SSR)
      if (isBrowser) {
        localStorage.removeItem('token');
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth')) {
          // Clear Zustand auth state trước khi redirect
          try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
              const parsed = JSON.parse(authStorage);
              parsed.state = { ...parsed.state, user: null, isAuthenticated: false };
              localStorage.setItem('auth-storage', JSON.stringify(parsed));
            }
          } catch (e) {
            localStorage.removeItem('auth-storage');
          }
          window.location.href = '/auth/login';
        }
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
