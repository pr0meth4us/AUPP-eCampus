import api from "./api";

export const course = {
    // === Course Methods ===
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

    getCourseById: async (courseId) => {
        const response = await api.get(`/courses/${courseId}`);
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

    enrollStudent: async (courseId) => {
        const response = await api.post(`/courses/${courseId}/enroll`);
        return response.data;
    },

    unenrollStudent: async (courseId, studentId) => {
        const response = await api.post(`/courses/${courseId}/unroll`, { student_id: studentId });
        return response.data;
    },

    getCourseMaterial: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/material`);
        return response.data;
    },

    // === Tag Methods ===
    fetchTags: async () => {
        const response = await api.get('/courses/tags');
        return response.data;
    },

    createTags: async (tagNames) => {
        const response = await api.post('/courses/tags', { names: tagNames });
        return response.data;
    },

    updateTag: async (tagId, name) => {
        const response = await api.put(`/courses/tags/${tagId}`, { name });
        return response.data;
    },

    deleteTag: async (tagId) => {
        const response = await api.delete(`/courses/tags/${tagId}`);
        return response.data;
    },

    // === Major Methods ===
    fetchMajors: async () => {
        const response = await api.get('/courses/majors');
        return response.data;
    },

    createMajors: async (majorNames) => {
        const response = await api.post('/courses/majors', { names: majorNames });
        return response.data;
    },

    updateMajor: async (majorId, name) => {
        const response = await api.put(`/courses/majors/${majorId}`, { name });
        return response.data;
    },

    deleteMajor: async (majorId) => {
        const response = await api.delete(`/courses/majors/${majorId}`);
        return response.data;
    },

    getAssignments: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/assignments`);
        return response.data;
    },

    addAssignment: async (courseId, assignmentData) => {
        const response = await api.post(`/courses/${courseId}/assignments`, assignmentData);
        return response.data;
    },

    deleteAssignment: async (courseId, assignmentId) => {
        const response = await api.delete(`/courses/${courseId}/assignments/${assignmentId}`);
        return response.data;
    },

    addSubmission: async (assignmentId, content) => {
        const response = await api.post(`/courses/assignments/${assignmentId}/submissions`, content, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    gradeSubmission: async (submissionId, gradeData) => {
        const response = await api.post(`/courses/submissions/${submissionId}/grade`, gradeData);
        return response.data;
    },

    getDetailsById: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/details`);
        return response.data;
    },

};
