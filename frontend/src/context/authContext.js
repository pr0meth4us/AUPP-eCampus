import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth, login as apiLogin, logout as apiLogout, register as apiRegister, send_otp as apiSendOtp } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await checkAuth();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } catch {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const sendOtp = async (email) => {
        try {
            await apiSendOtp(email);
        } catch (error) {
            throw error;
        }
    };

    const signup = async (name, email, password, role, verificationCode) => {
        try {
            await apiRegister(name, email, password, role, verificationCode);
            await login(email, password, role); // Auto-login the user after successful registration
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password, role) => {
        try {
            const data = await apiLogin(email, password, role);
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, sendOtp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
