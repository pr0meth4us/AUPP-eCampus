import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => axios.create({
    baseURL: `${API_BASE_URL}/${path}`,
    withCredentials: true
});
export default endpoint;