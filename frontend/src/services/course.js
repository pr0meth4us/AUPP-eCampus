import endpoint from "./api";
const api = endpoint("course");

export const course = {
    // ===== BASIC COURSE OPERATIONS =====
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

    getMyCourses: async () => {
        try {
            const response = await api.get('/my');
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            } else {
                console.error('Unexpected response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error in getMyCourses:', error);
            throw error;
        }
    },

    // ===== ENROLLMENT =====
    enrollStudent: async (courseId) => {
        const response = await api.post(`/${courseId}/enroll`);
        return response.data;
    },

    unenrollStudent: async (courseId, studentId) => {
        const response = await api.post(`/${courseId}/unroll`, { student_id: studentId });
        return response.data;
    },

    getEnrolledStudents: async (courseId) => {
        const response = await api.get(`/${courseId}/students`);
        return response.data;
    },

    // ===== COURSE VIEWS =====
    getPreviewById: async (courseId) => {
        const { data } = await api.get(`/${courseId}/preview`);
        return data;
    },

    getDetailById: async (courseId) => {
        const { data } = await api.get(`/${courseId}/detail`);
        return data;
    },

    getFullById: async (courseId) => {
        const { data } = await api.get(`/${courseId}/full`);
        return data;
    },

    // ===== COURSE ANALYTICS & PROGRESS =====
    getCourseAnalytics: async (courseId) => {
        const response = await api.get(`/${courseId}/analytics`);
        return response.data;
    },

    getCourseProgress: async (courseId) => {
        const response = await api.get(`/${courseId}/progress`);
        return response.data;
    },

    publishCourse: async (courseId, isPublished = true) => {
        const response = await api.put(`/${courseId}/publish`, { is_published: isPublished });
        return response.data;
    },

    getMaterialById: async (courseId, moduleId, materialId) => {
        const response = await api.get(`/${courseId}/modules/${moduleId}/materials/${materialId}`);
        return response.data;
    },

    // ===== TAGS & MAJORS =====
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

    // ===== MODULE OPERATIONS =====
    // Create module
    createModule: async (courseId, moduleData) => {
        const response = await api.post(`/${courseId}/modules`, moduleData);
        return response.data;
    },

    // Get all modules for a course
    getCourseModules: async (courseId) => {
        const response = await api.get(`/${courseId}/modules`);
        return response.data;
    },

    // Get single module with contents
    getModuleById: async (courseId, moduleId) => {
        const response = await api.get(`/${courseId}/modules/${moduleId}`);
        return response.data;
    },

    // Update module (full update)
    updateModule: async (courseId, moduleId, moduleData) => {
        const response = await api.put(`/${courseId}/modules/${moduleId}`, moduleData);
        return response.data;
    },

    // Edit module (partial update)
    editModule: async (courseId, moduleId, moduleData) => {
        const response = await api.patch(`/${courseId}/modules/${moduleId}`, moduleData);
        return response.data;
    },

    // Delete module
    deleteModule: async (courseId, moduleId) => {
        const response = await api.delete(`/${courseId}/modules/${moduleId}`);
        return response.data;
    },

    // Publish/unpublish module
    publishModule: async (courseId, moduleId, published = true) => {
        const response = await api.put(`/${courseId}/modules/${moduleId}/publish`, { published });
        return response.data;
    },

    // Reorder modules in course
    reorderModules: async (courseId, moduleOrder) => {
        const response = await api.patch(`/${courseId}/modules/order`, { order: moduleOrder });
        return response.data;
    },

    // ===== MODULE CONTENT OPERATIONS =====
    // Add content to module
    addModuleContent: async (courseId, moduleId, contentData) => {
        const response = await api.post(`/${courseId}/modules/${moduleId}/content`, contentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update module content
    updateModuleContent: async (courseId, moduleId, contentId, contentData) => {
        const response = await api.put(`/${courseId}/modules/${moduleId}/content/${contentId}`, contentData);
        return response.data;
    },

    // Delete module content
    deleteModuleContent: async (courseId, moduleId, contentId) => {
        const response = await api.delete(`/${courseId}/modules/${moduleId}/content/${contentId}`);
        return response.data;
    },

    // Reorder content within module
    reorderModuleContent: async (courseId, moduleId, contentOrder) => {
        const response = await api.patch(`/${courseId}/modules/${moduleId}/content/order`, { order: contentOrder });
        return response.data;
    },

    // ===== ASSIGNMENT OPERATIONS =====
    // Create assignment
    createAssignment: async (courseId, assignmentData) => {
        const response = await api.post(`/${courseId}/assignments`, assignmentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get all assignments for course (instructor view)
    getAssignments: async (courseId) => {
        const response = await api.get(`/${courseId}/assignments`);
        return response.data;
    },

    // Get assignments for student with submission status
    getStudentAssignments: async (courseId) => {
        const response = await api.get(`/${courseId}/assignments/student`);
        return response.data;
    },

    // Get assignment details
    getAssignmentById: async (courseId, assignmentId) => {
        const response = await api.get(`/${courseId}/assignments/${assignmentId}`);
        return response.data;
    },

    // Update assignment
    updateAssignment: async (courseId, assignmentId, assignmentData) => {
        const response = await api.put(`/${courseId}/assignments/${assignmentId}`, assignmentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete assignment
    deleteAssignment: async (courseId, assignmentId) => {
        const response = await api.delete(`/${courseId}/assignments/${assignmentId}`);
        return response.data;
    },

    // Submit assignment (student)
    submitAssignment: async (courseId, assignmentId, submissionData) => {
        const response = await api.post(`/${courseId}/assignments/${assignmentId}/submit`, submissionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get all submissions for assignment (instructor)
    getAssignmentSubmissions: async (courseId, assignmentId) => {
        const response = await api.get(`/${courseId}/assignments/${assignmentId}/submissions`);
        return response.data;
    },

    // ===== LEGACY ASSIGNMENT METHODS (for backward compatibility) =====
    addAssignment: async (courseId, assignmentData) => {
        return await course.createAssignment(courseId, assignmentData);
    },

    addSubmission: async (assignmentId, content) => {
        // Note: This might need courseId - check your routing
        const response = await api.post(`/assignments/${assignmentId}/submissions`, content, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    gradeSubmission: async (submissionId, gradeData) => {
        // Note: This might need courseId and assignmentId - check your routing
        const response = await api.post(`/submissions/${submissionId}/grade`, gradeData);
        return response.data;
    }
};