import axios from 'axios';
import {API_BASE_URL} from "../config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export const login = async (email, password, role, recaptchaResponse) => {
    const response = await api.post('/auth/login', { email, password, role, recaptcha_response: recaptchaResponse });
    return response.data;
};

export const send_otp = async (email) => {
    await api.post('/auth/send-otp', {email})
}

export const register = async (name, email, password, role, otp, token = null, captchaValue) => {
    const response = await api.post(`/auth/register`, { name, email, password,role, otp, token,captchaValue });
    return response.data;
};

export const registerInstructor = async (name, email, password) => {
    const response = await api.post(`/admin/instructor-register`, { name, email, password });
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
    const response = await api.put(`/admin/update-user/${userId}`, userData)
    return response.data;
};

export const createCourse = async (formData) => {
    const response = await api.post('/courses/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // This is necessary for file uploads
        }
    });
    return response.data;
};


export const getAllCourses = async () => {
    const response = await api.get('/admin/get-all-courses');
    return response.data;
};

export const updateCourse = async (courseId, courseData) => {
    const response = await api.put(`/admin/update-course/${courseId}`, courseData);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    const response = await api.delete(`/admin/delete-course/${courseId}`);
    return response.data;
};
