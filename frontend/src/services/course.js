import endpoint from "./api";
const api = endpoint("courses");
export const course = {
    createCourse: async (formData) => {
        const response = await api.post('', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAllCourses: async () => {
        const response = await api.get();
        return response.data;
    },

    getCourseById: async (courseId) => {
        const response = await api.get(`/${courseId}/details`);
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await api.put(`/${courseId}`, courseData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteCourse: async (courseId) => {
        const response = await api.delete(`/${courseId}`);
        return response.data;
    },

    enrollStudent: async (courseId) => {
        const response = await api.post(`/${courseId}/enroll`);
        return response.data;
    },

    unenrollStudent: async (courseId, studentId) => {
        const response = await api.post(`/${courseId}/unroll`, { student_id: studentId });
        return response.data;
    },

    getCourseMaterial: async (courseId) => {
        const response = await api.get(`/${courseId}/material`);
        return response.data;
    },

    // === Tag Methods ===
    fetchTags: async () => {
        const response = await api.get('/tags');
        return response.data;
    },

    createTags: async (tagNames) => {
        const response = await api.post('/tags', { names: tagNames });
        return response.data;
    },

    updateTag: async (tagId, name) => {
        const response = await api.put(`/tags/${tagId}`, { name });
        return response.data;
    },

    deleteTag: async (tagId) => {
        const response = await api.delete(`/tags/${tagId}`);
        return response.data;
    },

    // === Major Methods ===
    fetchMajors: async () => {
        const response = await api.get('/majors');
        return response.data;
    },

    createMajors: async (majorNames) => {
        const response = await api.post('/majors', { names: majorNames });
        return response.data;
    },

    updateMajor: async (majorId, name) => {
        const response = await api.put(`/majors/${majorId}`, { name });
        return response.data;
    },

    deleteMajor: async (majorId) => {
        const response = await api.delete(`/majors/${majorId}`);
        return response.data;
    },

    getAssignments: async (courseId) => {
        const response = await api.get(`/${courseId}/assignments`);
        return response.data;
    },

    getAssignmentById: async (courseId, assignmentId) => {
        const response = await api.get(`/${courseId}/assignments/${assignmentId}`);
        return response.data;
    },

    addAssignment: async (courseId, assignmentData) => {
        const response = await api.post(`/${courseId}/assignments`, assignmentData);
        return response.data;
    },

    deleteAssignment: async (courseId, assignmentId) => {
        const response = await api.delete(`/${courseId}/assignments/${assignmentId}`);
        return response.data;
    },

    addSubmission: async (assignmentId, content) => {
        const response = await api.post(`/assignments/${assignmentId}/submissions`, content, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    gradeSubmission: async (submissionId, gradeData) => {
        const response = await api.post(`/submissions/${submissionId}/grade`, gradeData);
        return response.data;
    },

    getPreviewById: async (courseId) => {
        const response = await api.get(`/${courseId}/preview`);
        return response.data;
    },

    getModuleById: async (courseId, moduleId) =>{
        const response = await api.get(`/${courseId}/modules/${moduleId}`);
        return response.data;
    },

    getMaterialById: async (courseId,moduleId, materialId) => {
        const response = await api.get(`/${courseId}/modules/${moduleId}/materials/${materialId}`);
        return response.data;
    }

};
