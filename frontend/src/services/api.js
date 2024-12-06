import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => {
    const instance = axios.create({
        baseURL: `${API_BASE_URL}${path ? `/${path.replace(/^\//, '')}` : ''}`,
        withCredentials: true,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    instance.interceptors.request.use(config => {
        config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
        return config;
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            console.error('Detailed API Error:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data
            });

            if (error.response) {
                switch (error.response.status) {
                    case 400: throw new Error('Bad Request');
                    case 401: throw new Error('Unauthorized');
                    case 403: throw new Error('Forbidden');
                    case 404: throw new Error('Resource Not Found');
                    case 500: throw new Error('Internal Server Error');
                    default: throw new Error('Network Error');
                }
            } else if (error.request) {
                throw new Error('No Response from Server');
            } else {
                throw new Error('Error Setting Up Request');
            }
        }
    );

    return instance;
};

export default endpoint;