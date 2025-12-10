import axios from 'axios';
import endpoint from "./api"; // Your local backend api wrapper

// --- CONFIGURATION ---
const BIFROST_API_URL = "https://objective-denna-auppecampus-9a7d86fc.koyeb.app/auth/api";
const BIFROST_CLIENT_ID = "aupp_ecampus_ee9c3153"; // Must match the ID in your Backend .env

const localApi = endpoint("auth"); // To call AUPP's /auth/sync-session

export const auth = {
    // --- STEP 1: REQUEST OTP (For Signup OR Forgot Password) ---
    sendOtp: async (email) => {
        const response = await axios.post(`${BIFROST_API_URL}/request-email-otp`, {
            email,
            client_id: BIFROST_CLIENT_ID
        });
        return response.data; // returns verification_id
    },

    // --- STEP 2: VERIFY OTP ---
    verifyOtp: async (verificationId, code) => {
        const response = await axios.post(`${BIFROST_API_URL}/verify-email-otp`, {
            verification_id: verificationId,
            code
        });
        return response.data; // returns proof_token
    },

    // --- STEP 3: COMPLETE REGISTRATION ---
    completeRegistration: async (proofToken, password, displayName) => {
        const response = await axios.post(`${BIFROST_API_URL}/complete-registration`, {
            proof_token: proofToken,
            password,
            display_name: displayName,
            client_id: BIFROST_CLIENT_ID
        });

        if (response.data.jwt) {
            await auth.syncSession(response.data.jwt);
        }
        return response.data;
    },

    // --- NEW: RESET PASSWORD ---
    resetPassword: async (proofToken, newPassword) => {
        const response = await axios.post(`${BIFROST_API_URL}/reset-password`, {
            proof_token: proofToken,
            password: newPassword
        });
        return response.data; // returns success message
    },

    // --- STANDARD LOGIN ---
    login: async (email, password) => {
        const response = await axios.post(`${BIFROST_API_URL}/login`, {
            client_id: BIFROST_CLIENT_ID,
            email,
            password
        });

        if (response.data.jwt) {
            await auth.syncSession(response.data.jwt);
        }
        return response.data;
    },

    // --- LOCAL SESSION SYNC ---
    syncSession: async (token) => {
        localStorage.setItem('token', token);
        const response = await localApi.post('/sync-session', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    checkAuth: async () => {
        const response = await localApi.get('/check');
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try { await localApi.post('/logout'); } catch (e) {}
        return { success: true };
    }
};