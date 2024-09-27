import axios from 'axios';
import {API_BASE_URL} from "../config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export const login = async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
};

export const send_otp = async (email) => {
    await api.post('/auth/send-otp', {email})
}

export const registerInstructor = async (name, email, password) => {
    const response = await api.post(`/admin/instructor-register`, { name, email, password });
    return response.data;
};


export const register = async (name, email, password, role, otp, token = null) => {
    const response = await api.post(`/auth/register`, { name, email, password,role, otp, token });
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


export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/delete-user/${userId}`);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/admin/update-user/${userId}`, userData);
    return response.data;
};
