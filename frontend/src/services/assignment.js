import endpoint from "./api";

// Create assignment-specific API instance
const createAssignmentApi = (courseId) => endpoint(`course/${courseId}/assignments`);

export const assignment = {
    createAssignment: async (courseId, assignmentData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.post("", assignmentData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    getCourseAssignments: async (courseId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get("");
        return response.data;
    },

    getStudentAssignments: async (courseId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get("/student");
        return response.data;
    },

    getAssignmentDetails: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get(`/${assignmentId}`);
        return response.data;
    },

    updateAssignment: async (courseId, assignmentId, assignmentData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.put(`/${assignmentId}`, assignmentData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    deleteAssignment: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.delete(`/${assignmentId}`);
        return response.data;
    },

    publishAssignment: async (courseId, assignmentId, data) => {
        const api = createAssignmentApi(courseId);
        // Now POST to /{assignmentId}/publish
        const response = await api.post(`/${assignmentId}/publish`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    },

    submitAssignment: async (courseId, assignmentId, submissionData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.post(`/${assignmentId}/submit`, submissionData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    // ←–– CHANGE HERE: now takes submissionId, not studentId
    gradeSubmission: async (courseId, assignmentId, submissionId, gradeData) => {
        const api = createAssignmentApi(courseId);
        // POST to /{assignmentId}/grade/{submissionId}
        const response = await api.post(
            `/${assignmentId}/grade/${submissionId}`,
            gradeData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    },

    getAssignmentSubmissions: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get(`/${assignmentId}/submissions`);
        return response.data;
    },

    // —––––– OPTIONAL HELPERS (not strictly needed in EditCourse) —–––––

    // Create a text‐only assignment
    createTextAssignment: async (courseId, title, description, dueDate, points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append("title", title);
        assignmentData.append("description", description);
        if (dueDate) assignmentData.append("due_date", dueDate);
        assignmentData.append("points", points.toString());
        assignmentData.append("assignment_type", "text");
        return await assignment.createAssignment(courseId, assignmentData);
    },

    // Create a file‐upload assignment
    createFileAssignment: async (
        courseId,
        title,
        description,
        dueDate,
        allowedTypes = ["pdf", "doc", "docx", "txt", "zip"],
        maxFiles = 1,
        points = 100
    ) => {
        const assignmentData = new FormData();
        assignmentData.append("title", title);
        assignmentData.append("description", description);
        if (dueDate) assignmentData.append("due_date", dueDate);
        assignmentData.append("points", points.toString());
        assignmentData.append("assignment_type", "file_upload");
        assignmentData.append("allowed_file_types", allowedTypes.join(","));
        assignmentData.append("max_files", maxFiles.toString());
        return await assignment.createAssignment(courseId, assignmentData);
    },

    // Grade and provide feedback
    gradeWithFeedback: async (courseId, assignmentId, submissionId, grade, feedback) => {
        const gradeData = {
            grade: parseFloat(grade),
            feedback: feedback,
        };
        return await assignment.gradeSubmission(
            courseId,
            assignmentId,
            submissionId,
            gradeData
        );
    },
};

export default assignment;
