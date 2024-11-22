import api from "./api";

export const payment = {
    createPayment: async (courseId) => {
        const response = await api.post('/payment/create', { course_id: courseId });
        return response.data;
    },

    paymentSuccess: async (token, paymentId, payerId) => {
        const response = await api.get(`/payment/success`, {
            params: { token, paymentId, payerId }
        });
        return response.data;
    },

    getPaymentById: async (paymentId) => {
        const response = await api.get(`/payment/${paymentId}`);
        return response.data;
    },

    getCoursePayment: async (courseId) => {
        const response = await api.get(`/payment/course/${courseId}`);
        return response.data;
    }
};