import api from "./api";

export const student = {
    createProfile: async () => {
        const response = await api.post('/student/');
        return response.data;
    },

    getProfile: async (studentId) => {
        const response = await api.get(`/student/${studentId}`);
        return response.data;
    },

    updateProfile: async (studentId, data) => {
        const response = await api.put(`/student/${studentId}`, data);
        return response.data;
    },

    deleteProfile: async (studentId) => {
        const response = await api.delete(`/student/${studentId}`);
        return response.data;
    },

    uploadProfileImage: async (studentId, imageData) => {
        const response = await api.post(`/student/${studentId}/upload-image`, imageData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};