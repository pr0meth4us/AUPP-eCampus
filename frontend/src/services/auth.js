import endpoint from "./api";
const api = endpoint("auth");

export const auth = {
    // Called by the Callback Page
    syncSession: async (token) => {
        // We send the token in the header (handled by interceptor)
        // OR manually here since we are setting it up.
        // Let's pass it in the body for the sync call, or set it in localStorage before calling.
        const response = await api.post('/sync-session', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Used by context to check if session is still valid
    checkAuth: async () => {
        const response = await api.get('/check');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    }
};