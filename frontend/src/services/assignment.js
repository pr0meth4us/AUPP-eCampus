import endpoint from "./api";

// Create assignment-specific API instance
const createAssignmentApi = (courseId) => endpoint(`course/${courseId}/assignments`);

export const assignmentApi = {
    // ===== ASSIGNMENT CRUD OPERATIONS =====

    // Create a new assignment (instructor only)
    createAssignment: async (courseId, assignmentData) => {
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
    updateAssignment: async (courseId, assignmentId, assignmentData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.put(`/${assignmentId}`, assignmentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete assignment (instructor only)
    deleteAssignment: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.delete(`/${assignmentId}`);
        return response.data;
    },

    // ===== SUBMISSION OPERATIONS =====

    // Submit assignment (student only)
    submitAssignment: async (courseId, assignmentId, submissionData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.post(`/${assignmentId}/submit`, submissionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Grade assignment submission (instructor only)
    gradeSubmission: async (courseId, assignmentId, studentId, gradeData) => {
        const api = createAssignmentApi(courseId);
        const response = await api.post(`/${assignmentId}/grade/${studentId}`, gradeData);
        return response.data;
    },

    // Get all submissions for assignment (instructor only)
    getAssignmentSubmissions: async (courseId, assignmentId) => {
        const api = createAssignmentApi(courseId);
        const response = await api.get(`/${assignmentId}/submissions`);
        return response.data;
    },

    // ===== HELPER METHODS =====

    // Create simple text assignment
    createTextAssignment: async (courseId, title, description, dueDate, points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        assignmentData.append('due_date', dueDate);
        assignmentData.append('points', points.toString());
        assignmentData.append('assignment_type', 'text');

        return await assignmentApi.createAssignment(courseId, assignmentData);
    },

    // Create file upload assignment
    createFileAssignment: async (courseId, title, description, dueDate, allowedTypes = ['pdf', 'doc', 'docx'], maxFiles = 1, points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        assignmentData.append('due_date', dueDate);
        assignmentData.append('points', points.toString());
        assignmentData.append('assignment_type', 'file');
        assignmentData.append('allowed_file_types', allowedTypes.join(','));
        assignmentData.append('max_files', maxFiles.toString());

        return await assignmentApi.createAssignment(courseId, assignmentData);
    },

    // Create assignment with attachments
    createAssignmentWithAttachments: async (courseId, title, description, dueDate, attachments = [], points = 100) => {
        const assignmentData = new FormData();
        assignmentData.append('title', title);
        assignmentData.append('description', description);
        assignmentData.append('due_date', dueDate);
        assignmentData.append('points', points.toString());

        // Add attachment files
        attachments.forEach((file, index) => {
            assignmentData.append(`attachment_${index}`, file);
        });

        return await assignmentApi.createAssignment(courseId, assignmentData);
    },

    // Submit text assignment
    submitTextAssignment: async (courseId, assignmentId, textContent) => {
        const submissionData = new FormData();
        submissionData.append('content', textContent);

        return await assignmentApi.submitAssignment(courseId, assignmentId, submissionData);
    },

    // Submit file assignment
    submitFileAssignment: async (courseId, assignmentId, files, textContent = '') => {
        const submissionData = new FormData();
        submissionData.append('content', textContent);

        // Add files
        files.forEach((file) => {
            submissionData.append('files', file);
        });

        return await assignmentApi.submitAssignment(courseId, assignmentId, submissionData);
    },

    // Grade with feedback
    gradeWithFeedback: async (courseId, assignmentId, studentId, grade, feedback) => {
        const gradeData = {
            grade: parseFloat(grade),
            feedback: feedback
        };

        return await assignmentApi.gradeSubmission(courseId, assignmentId, studentId, gradeData);
    },

    // Bulk grade assignments
    bulkGradeAssignments: async (courseId, assignmentId, grades) => {
        const results = [];

        for (const gradeData of grades) {
            try {
                const result = await assignmentApi.gradeSubmission(
                    courseId,
                    assignmentId,
                    gradeData.studentId,
                    {
                        grade: gradeData.grade,
                        feedback: gradeData.feedback || ''
                    }
                );
                results.push({
                    success: true,
                    studentId: gradeData.studentId,
                    result
                });
            } catch (error) {
                results.push({
                    success: false,
                    studentId: gradeData.studentId,
                    error: error.message
                });
            }
        }

        return results;
    },

    // Get assignment statistics
    getAssignmentStats: async (courseId, assignmentId) => {
        try {
            const submissions = await assignmentApi.getAssignmentSubmissions(courseId, assignmentId);

            const stats = {
                totalSubmissions: submissions.length,
                submittedCount: submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
                gradedCount: submissions.filter(s => s.status === 'graded').length,
                pendingCount: submissions.filter(s => s.status === 'submitted').length,
                notSubmittedCount: submissions.filter(s => s.status === 'not_submitted').length,
                averageGrade: 0,
                highestGrade: 0,
                lowestGrade: 0
            };

            const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined);
            if (gradedSubmissions.length > 0) {
                const grades = gradedSubmissions.map(s => parseFloat(s.grade));
                stats.averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
                stats.highestGrade = Math.max(...grades);
                stats.lowestGrade = Math.min(...grades);
            }

            return stats;
        } catch (error) {
            throw new Error(`Failed to get assignment statistics: ${error.message}`);
        }
    },

    // Check if assignment is past due
    isAssignmentPastDue: async (courseId, assignmentId) => {
        try {
            const assignment = await assignmentApi.getAssignmentDetails(courseId, assignmentId);
            if (!assignment.due_date) return false;

            const dueDate = new Date(assignment.due_date);
            const now = new Date();

            return now > dueDate;
        } catch (error) {
            throw new Error(`Failed to check assignment due date: ${error.message}`);
        }
    },

    // Get student's submission status for assignment
    getStudentSubmissionStatus: async (courseId, assignmentId) => {
        try {
            const studentAssignments = await assignmentApi.getStudentAssignments(courseId);
            const assignment = studentAssignments.find(a => a._id === assignmentId);

            return assignment ? assignment.submission_status : 'not_submitted';
        } catch (error) {
            throw new Error(`Failed to get submission status: ${error.message}`);
        }
    }
};