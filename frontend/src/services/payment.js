import endpoint from "./api";
const api = endpoint("payment");
export const payment = {
    createPayment: async (courseId) => {
        const response = await api.post('/create', { course_id: courseId });
        return response.data;
    },

    paymentSuccess: async (token, paymentId, PayerID) => {
        const response = await api.get(`/success`, {
            params: { token, paymentId, PayerID }
        });
        return response.data;
    },

    getPaymentById: async (paymentId) => {
        const response = await api.get(`/${paymentId}`);
        return response.data;
    },

    getCoursePayment: async (courseId) => {
        const response = await api.get(`/${courseId}`);
        return response.data;
    }
};