import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => {
    const instance = axios.create({
        baseURL: `${API_BASE_URL}/${path}`,
        withCredentials: true,
    });

    // Add a request interceptor
    instance.interceptors.request.use(
        config => {
            if (config.url) {
                config.url = config.url.replace(/([^:]\/)\/+/g, "$1"); // Ensure no double slashes
            }
            return config;
        },
        error => Promise.reject(error)
    );

    return instance;
};

export default endpoint;
