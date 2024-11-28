import endpoint from "./api";
const api = endpoint("auth");
export const auth = {
    login: async (email, password, role, recaptchaResponse) => {
        const response = await api.post('/login', {
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
        const response = await api.post('/register', {
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
        const response = await api.post('/signout');
        return response.data;
    },

    checkAuth: async () => {
        const response = await api.get('/check');
        return response.data;
    }
};