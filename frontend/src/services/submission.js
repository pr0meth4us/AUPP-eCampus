import api from "./api";

export const submission = {
    uploadSubmission: async (assignmentId, content) => {
        const response = await api.post(`/assignments/${assignmentId}`, { content });
        return response.data;
    },

    gradeSubmission: async (assignmentId, grade, feedback) => {
        const response = await api.post(`/assignments/${assignmentId}/grade`, { grade, feedback });
        return response.data;
    }
};