import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth, login as apiLogin, logout as apiLogout } from "../services/api";

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
                    throw new Error("User not authenticated");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password, role) => {
        try {
            const data = await apiLogin(email, password, role);
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                throw new Error("Login failed: No user data received");
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    console.log("Current auth state:", { user, loading });

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);