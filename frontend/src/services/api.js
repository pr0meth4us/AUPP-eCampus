import axios from 'axios';

const baseClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const loadingEmitter = new EventTarget();
let activeRequests = 0;

baseClient.interceptors.request.use((config) => {
    activeRequests++;
    loadingEmitter.dispatchEvent(new CustomEvent('loading', { detail: true }));
    return config;
});

baseClient.interceptors.response.use(
    (response) => {
        activeRequests--;
        if (activeRequests === 0) {
            loadingEmitter.dispatchEvent(new CustomEvent('loading', { detail: false }));
        }
        return response;
    },
    (error) => {
        activeRequests--;
        if (activeRequests === 0) {
            loadingEmitter.dispatchEvent(new CustomEvent('loading', { detail: false }));
        }
        return Promise.reject(error);
    }
);

// Factory function: returns an axios instance scoped to a given path prefix.
// Services call this as: import endpoint from './api'; const api = endpoint('course');
const endpoint = (prefix) => ({
    get:    (path = '', config) => baseClient.get(`/${prefix}${path}`, config),
    post:   (path = '', data, config) => baseClient.post(`/${prefix}${path}`, data, config),
    put:    (path = '', data, config) => baseClient.put(`/${prefix}${path}`, data, config),
    patch:  (path = '', data, config) => baseClient.patch(`/${prefix}${path}`, data, config),
    delete: (path = '', config) => baseClient.delete(`/${prefix}${path}`, config),
});

export default endpoint;