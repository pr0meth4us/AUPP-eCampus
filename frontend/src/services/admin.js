import api from "./api";

export const admin = {
    registerUser: async (name, email, password, role) => {
        const response = await api.post('/admin/register', {
            name,
            email,
            password,
            role
        });
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/admin/getall');
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/delete-user/${userId}`);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/admin/update-user/${userId}`, userData);
        return response.data;
    },

    fetchAllVideos: async () => {
        const response = await api.get('/admin/get-video');
        return response.data;
    },

    deleteVideo: async (videoId) => {
        const response = await api.delete(`/admin/delete-video/${videoId}`);
        return response.data;
    }
};