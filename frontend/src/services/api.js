/* src/apiClient.js */
import axios from 'axios';

// Simple event emitter for loading state
export const loadingEmitter = new EventTarget();
const setLoading = (isLoading) => {
  loadingEmitter.dispatchEvent(new CustomEvent('loading', { detail: isLoading }));
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: start loading, attach token
apiClient.interceptors.request.use(
  (config) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor: stop loading, handle auth
apiClient.interceptors.response.use(
  (response) => {
    setLoading(false);
    return response;
  },
  (error) => {
    setLoading(false);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const endpoint = (path) => ({
  get:    (url, config) => apiClient.get(`/${path}${url}`, config),
  post:   (url, data, config) => apiClient.post(`/${path}${url}`, data, config),
  put:    (url, data, config) => apiClient.put(`/${path}${url}`, data, config),
  delete: (url, config) => apiClient.delete(`/${path}${url}`, config),
});

export default endpoint;
