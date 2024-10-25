import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../services";

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
                const data = await auth.checkAuth();
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
            await auth.sendOtp(email);
        } catch (error) {
            throw error;
        }
    };

    const signup = async (name, email, password, role, verificationCode) => {
        try {
            await auth.register(name, email, password, role, verificationCode);
            await login(email, password, role); // Auto-login the user after successful registration
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password, role) => {
        try {
            const data = await auth.login(email, password, role);
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
        await auth.logout();
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
