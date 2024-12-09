import axios from 'axios';

const endpoint = (path = "") => {
    const instance = axios.create({
        baseURL: `https://aupp-ecampus-production.up.railway.app/${path}`,
        withCredentials: true,
    });

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
