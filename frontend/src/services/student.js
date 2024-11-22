import api from "./api";

export const student = {
    createProfile: async (data) => {
        const response = await api.post('/students', data);
        return response.data;
    },

    getProfile: async (studentId) => {
        const response = await api.get(`/students/${studentId}`);
        return response.data;
    },

    updateProfile: async (studentId, data) => {
        const response = await api.put(`/students/${studentId}`, data);
        return response.data;
    },

    deleteProfile: async (studentId) => {
        const response = await api.delete(`/students/${studentId}`);
        return response.data;
    },

    uploadProfileImage: async (studentId, imageData) => {
        const response = await api.post(`/students/${studentId}/upload-image`, imageData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};