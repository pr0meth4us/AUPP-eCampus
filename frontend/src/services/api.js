// src/utils/endpoint.ts
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL?.replace(/\/+$/, '');

const endpoint = (path = '') => {
    const instance = axios.create({
        baseURL: `${baseURL}/${path}`.replace(/([^:]\/)\/+/g, '$1'),
        withCredentials: true,
    });

    // optional: keep your double-slash sanitizer
    instance.interceptors.request.use(
        cfg => {
            if (cfg.url) {
                cfg.url = cfg.url.replace(/([^:]\/)\/+/g, '$1');
            }
            return cfg;
        },
        err => Promise.reject(err)
    );

    return instance;
};

export default endpoint;
