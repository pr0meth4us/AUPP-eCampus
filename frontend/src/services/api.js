import axios from 'axios';
import { API_BASE_URL } from "../config";

const endpoint = (path = "") => axios.create({
    baseURL: `${API_BASE_URL}/${path}`,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': 'https://ecampusauppedu.vercel.app'
    }
});
export default endpoint;