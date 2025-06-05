import endpoint from "./api";

// Create assignment-specific API instance
const createAssignmentApi = (courseId) => endpoint(`course/${courseId}/assignments`);

export const assignment = {

    createAssignment: async (courseId, assignmentData) => { // assignmentData is expected to be FormData
        const api = createAssignmentApi(courseId);
        const response = await api.post('', assignmentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get all assignments for course (instructor view)
    getCourseAssignments: async (courseId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get('');
        return response.data;
    },

    // Get assignments with student submission status
    getStudentAssignments: async (courseId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get('/student');
        return response.data;
    },

    // Get detailed assignment information
    getAssignmentDetails: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get(`/${assignmentId}`);
        return response.data;
    },

    // Update assignment details (instructor only)
    // assignmentData is expected to be FormData if you want to align with multipart/form-data
    // If your backend PUT endpoint can also consume application/json for metadata-only updates,
    // then this function could be made more flexible or you might have a separate one.
    // For consistency with createAssignment and backend's @validate_file_upload, keeping it as expecting FormData.
    updateAssignment: async (courseId, assignmentId, assignmentData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.put(`/${assignmentId}`, assignmentData, {
            headers: { 'Content-Type': 'multipart/form-data' } // Sticks to multipart for potential file updates
        });
        return response.data;
    },

    // Delete assignment (instructor only)
    deleteAssignment: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.delete(`/${assignmentId}`);
        return response.data;
    },

    // Publish or unpublish an assignment
    // The 'data' parameter should be an object, e.g., { is_published: true }
    // This will be sent as JSON body to the POST /publish endpoint.
    publishAssignment: async (courseId, assignmentId, data) => {
        const api = createAssignmentApi(courseId);
        // Your backend route is POST /course/{courseId}/assignments/{assignmentId}/publish
        // It will likely expect a JSON body indicating the new publish status.
        const response = await api.post(`/${assignmentId}/publish`, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    // ===== SUBMISSION OPERATIONS =====

    // Submit assignment (student only)
    submitAssignment: async (courseId, assignmentId, submissionData) => { // submissionData is expected to be FormData
        const api = createAssignmentApi(courseId);
        const response = await api.post(`/${assignmentId}/submit`, submissionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Grade assignment submission (instructor only)
    // gradeData is an object like { grade: 90, feedback: "Good job" }
    gradeSubmission: async (courseId, assignmentId, studentId, gradeData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.post(`/${assignmentId}/grade/${studentId}`, gradeData, {
            headers: { 'Content-Type': 'application/json' } // Grading data is typically JSON
        });
        return response.data;
    },

    // Get all submissions for assignment (instructor only)
    getAssignmentSubmissions: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get(`/${assignmentId}/submissions`);
        return response.data;
    },

    // ===== HELPER METHODS (These call the CRUD operations above) =====

    createTextAssignment: async (courseId, title, description, dueDate, points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        if (dueDate) assignmentData.append('due_date', dueDate); // Ensure dueDate is in a format backend expects (e.g., ISO string)
        assignmentData.append('points', points.toString());
        assignmentData.append('assignment_type', 'text');
        // Add any other required fields by your backend for 'text' type assignments
        return await assignment.createAssignment(courseId, assignmentData);
    },

    createFileAssignment: async (courseId, title, description, dueDate, allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'zip'], maxFiles = 1, points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        if (dueDate) assignmentData.append('due_date', dueDate);
        assignmentData.append('points', points.toString());
        assignmentData.append('assignment_type', 'file_upload'); // Changed 'file' to 'file_upload' to match frontend type
        assignmentData.append('allowed_file_types', allowedTypes.join(','));
        assignmentData.append('max_files', maxFiles.toString());
        // Add any other required fields by your backend for 'file_upload' type assignments
        return await assignment.createAssignment(courseId, assignmentData);
    },

    createAssignmentWithAttachments: async (courseId, title, description, dueDate, attachments = [], points = 100, assignmentType = 'text') => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        if (dueDate) assignmentData.append('due_date', dueDate);
        assignmentData.append('points', points.toString());
        assignmentData.append('assignment_type', assignmentType);

        attachments.forEach((file, index) => {
            // Backend needs to be configured to look for fields like 'attachment_0', 'attachment_1', etc.
            // or a common field name if it supports multiple files under one key.
            assignmentData.append(`attachments`, file, file.name); // Standard way is to use same field name
        });

        return await assignment.createAssignment(courseId, assignmentData);
    },

    submitTextAssignment: async (courseId, assignmentId, textContent) => {
        const submissionData = new FormData();
        submissionData.append('content', textContent);
        // If your backend expects 'submission_type' or similar, add it here.
        return await assignment.submitAssignment(courseId, assignmentId, submissionData);
    },

    submitFileAssignment: async (courseId, assignmentId, files, textContent = '') => {
        const submissionData = new FormData();
        if (textContent) submissionData.append('content', textContent);

        files.forEach((file) => {
            // Backend needs to be configured to look for fields like 'files' (for multiple) or specific names.
            submissionData.append('files', file, file.name); // Sending multiple files under the same field name 'files'
        });
        return await assignment.submitAssignment(courseId, assignmentId, submissionData);
    },

    gradeWithFeedback: async (courseId, assignmentId, studentId, grade, feedback) => {
        const gradeData = {
            grade: parseFloat(grade),
            feedback: feedback
        };
        return await assignment.gradeSubmission(courseId, assignmentId, studentId, gradeData);
    },

    bulkGradeAssignments: async (courseId, assignmentId, grades) => {
        const results = [];
        for (const gradeData of grades) {
            try {
                const result = await assignment.gradeSubmission(
                    courseId,
                    assignmentId,
                    gradeData.studentId,
                    {
                        grade: gradeData.grade,
                        feedback: gradeData.feedback || ''
                    }
                );
                results.push({ success: true, studentId: gradeData.studentId, result });
            } catch (error) {
                results.push({ success: false, studentId: gradeData.studentId, error: error.message });
            }
        }
        return results;
    },

    getAssignmentStats: async (courseId, assignmentId) => {
        try {
            const submissions = await assignment.getAssignmentSubmissions(courseId, assignmentId);
            // ... (rest of the stats logic)
            const stats = {
                totalSubmissions: submissions.length,
                submittedCount: submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
                gradedCount: submissions.filter(s => s.status === 'graded').length,
                pendingCount: submissions.filter(s => s.status === 'submitted' && s.status !== 'graded').length, // Corrected pending
                // notSubmittedCount needs total enrolled students vs submitted, which is not available solely from submissions.
                // This stat might be better calculated on the backend or with more data.
            };
            const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined && s.status === 'graded');
            if (gradedSubmissions.length > 0) {
                const grades = gradedSubmissions.map(s => parseFloat(s.grade));
                stats.averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
                stats.highestGrade = Math.max(...grades);
                stats.lowestGrade = Math.min(...grades);
            } else {
                stats.averageGrade = 0;
                stats.highestGrade = 0;
                stats.lowestGrade = 0;
            }
            return stats;
        } catch (error) {
            console.error(`Failed to get assignment statistics: ${error.message}`, error);
            throw new Error(`Failed to get assignment statistics: ${error.message}`);
        }
    },

    isAssignmentPastDue: async (courseId, assignmentId) => {
        try {
            const assignment = await assignment.getAssignmentDetails(courseId, assignmentId);
            if (!assignment.due_date) return false;
            const dueDate = new Date(assignment.due_date);
            const now = new Date();
            return now > dueDate;
        } catch (error) {
            console.error(`Failed to check assignment due date: ${error.message}`, error);
            throw new Error(`Failed to check assignment due date: ${error.message}`);
        }
    },

    getStudentSubmissionStatus: async (courseId, assignmentId) => { // This would typically need student_id too
        try {
            // This endpoint /student returns all assignments for THE CURRENTLY LOGGED IN student.
            // To get status for a specific student (as an instructor), you'd need a different endpoint
            // or parse all submissions for the assignment.
            const studentAssignments = await assignment.getStudentAssignments(courseId);
            const assignment = studentAssignments.find(a => (a._id === assignmentId || a.id === assignmentId) );
            return assignment ? assignment.submission_status : 'not_submitted'; // submission_status would be on the assignment for that student
        } catch (error) {
            console.error(`Failed to get submission status: ${error.message}`, error);
            throw new Error(`Failed to get submission status: ${error.message}`);
        }
    }
};