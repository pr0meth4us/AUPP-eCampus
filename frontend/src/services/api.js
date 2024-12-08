import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => axios.create({
    baseURL: `${API_BASE_URL}/${path}`,
    withCredentials: true,
});
endpoint.interceptors.request.use(config => {
    config.url = config.url.replace('//', '/');
    return config;
});
export default endpoint;