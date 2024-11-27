import api from "./api";

export const auth = {
    login: async (email, password, role, recaptchaResponse) => {
        const response = await api.post('/auth/login', {
            email,
            password,
            role,
            recaptcha_response: recaptchaResponse
        });
        return response.data;
    },

    sendOtp: async (email) => {
        await api.post('/auth/send-otp', { email });
    },

    register: async (name, email, password, role, otp, token = null, captchaValue) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password,
            role,
            otp,
            token,
            captchaValue
        });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/signout');
        return response.data;
    },

    checkAuth: async () => {
        const response = await api.get('/auth/check');
        return response.data;
    }
};