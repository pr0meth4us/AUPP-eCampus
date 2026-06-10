import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    withCredentials: true, // MANDATORY for HttpOnly Cookies
    headers: {
        'Content-Type': 'application/json',
    }
});

export const loadingEmitter = new EventTarget();
let activeRequests = 0;

api.interceptors.request.use((config) => {
    activeRequests++;
    loadingEmitter.dispatchEvent(new CustomEvent('loading', { detail: true }));
    return config;
});

api.interceptors.response.use(
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

// Remove the old interceptor that was manually attaching 
// localStorage tokens. The browser does this automatically now.
export default api;