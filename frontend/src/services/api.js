import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => {
    const instance = axios.create({
        baseURL: `${API_BASE_URL}${path ? `/${path}` : ''}`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            console.error('API Error:', error);

            if (error.response) {

            } else if (error.request) {
                console.error('No response received');
            } else {
                console.error('Error', error.message);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default endpoint;