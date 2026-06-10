import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check if we have a valid session cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me'); // Create this simple endpoint in backend
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password, role, turnstile_token) => {
        const res = await api.post('/auth/login', { email, password, role, turnstile_token });
        setUser(res.data.user); // The cookie is set automatically by the browser
        return res.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        window.location.href = '/';
    };

    // Bifrost Headless Helpers
    const sendOtp = async (email) => {
        const res = await api.post('/auth/request-otp', { email });
        return res.data;
    };

    const verifyOtp = async (verificationId, code) => {
        const res = await api.post('/auth/verify-otp', { verification_id: verificationId, code });
        return res.data;
    };

    const completeRegistration = async (proofToken, password, name, turnstile_token) => {
        const res = await api.post('/auth/complete-registration', {
            proof_token: proofToken,
            password,
            name,
            turnstile_token
        });
        setUser(res.data.user);
        return res.data;
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, loading,
            sendOtp, verifyOtp, completeRegistration
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);