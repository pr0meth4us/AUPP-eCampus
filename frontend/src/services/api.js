import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token from localStorage as fallback
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const endpoint = (path) => ({
  get: (url, config) => apiClient.get(`/${path}${url}`, config),
  post: (url, data, config) => apiClient.post(`/${path}${url}`, data, config),
  put: (url, data, config) => apiClient.put(`/${path}${url}`, data, config),
  delete: (url, config) => apiClient.delete(`/${path}${url}`, config),
});

export default endpoint;