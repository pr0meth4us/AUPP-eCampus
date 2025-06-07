import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL?.replace(/\/+$/, '');

const endpoint = (path = '') => {
    const instance = axios.create({
        baseURL: `${baseURL}/${path}`.replace(/([^:]\/)\/+/g, '$1'),
        withCredentials: true,
    });

    instance.interceptors.request.use(cfg => {
        if (cfg.url) cfg.url = cfg.url.replace(/([^:]\/)\/+/g, '$1');

        const token = localStorage.getItem('token');
        if (token) {
            cfg.headers = cfg.headers || {};
            cfg.headers.Authorization = `Bearer ${token}`;
        }

        return cfg;
    });

    return instance;
};

export default endpoint;
