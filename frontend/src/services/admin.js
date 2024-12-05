import endpoint from "./api";
const api = endpoint("/admin");

export const admin = {
    registerUser: async (name, email, password, role) => {
        const response = await api.post(`/register`, {
            name,
            email,
            password,
            role
        });
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get(`/getall`);
        return response.data;
    },

    getAllCourses: async () => {
        const response = await api.get(`/courses`);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/delete-user/${userId}`);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/update-user/${userId}`, userData);
        return response.data;
    },

    fetchAllVideos: async () => {
        const response = await api.get(`/get-video`);
        return response.data;
    },

    deleteVideo: async (videoId) => {
        const response = await api.delete(`/delete-video/${videoId}`);
        return response.data;
    }
};
