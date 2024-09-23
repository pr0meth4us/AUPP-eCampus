import axios from 'axios';
import {API_BASE_URL} from "../config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export const login = async (email, password, role) => {
    const response = await api.post('http://localhost:5001/auth/login', { email, password, role });
    return response.data;
};

export const register = async (name, email, password, role, token = null) => {
    const response = await api.post(`/auth/register/${role}`, { name, email, password, token });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const checkAuth = async () => {
    const response = await api.get('/auth/check');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/admin/getall');
    return response.data;
};

export const registerInstructor = async (instructorData) => {
    const response = await api.post('/admin/instructor-register', instructorData);
    return response.data;
};