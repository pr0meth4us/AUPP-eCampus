import api from "./api";

export const course = {
    createCourse: async (formData) => {
        const response = await api.post('/courses/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAllCourses: async () => {
        const response = await api.get('/courses/');
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await api.put(`/courses/${courseId}`, courseData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteCourse: async (courseId) => {
        const response = await api.delete(`/courses/${courseId}`);
        return response.data;
    },

    fetchTags: async () => {
        const response = await api.get('/courses/tags');
        return response.data;
    },

    fetchMajors: async () => {
        const response = await api.get('/courses/majors');
        return response.data;
    }
};