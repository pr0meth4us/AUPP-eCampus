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
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setLoading(false);
                    return;
                }

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
        await auth.sendOtp(email);
    };

    const signup = async (name, email, password, role, verificationCode) => {
        await auth.register(name, email, password, role, verificationCode);
        await login(email, password, role);
    };

    const login = async (email, password, role) => {
        const data = await auth.login(email, password, role);
        if (data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        window.location.reload();
        return data;
    };

    const logout = async () => {
        await auth.logout();
        setUser(null);
        localStorage.removeItem('user');
    };

    const refreshUser = async () => {
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
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, sendOtp, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
