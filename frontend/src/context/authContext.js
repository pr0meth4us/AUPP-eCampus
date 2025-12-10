import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, user as userService } from '../services';

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
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check authentication
        const data = await auth.checkAuth();
        if (data.authenticated && data.user) {
          // Merge with full profile if needed
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // New method called by AuthCallbackPage
  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);

    // Call backend to sync (create/update local user)
    const data = await auth.syncSession(token);

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
        await auth.logout();
    } catch (e) {
        console.error(e);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Legacy stubs to prevent crashes if components still call them
  const sendOtp = async () => console.warn("OTP is deprecated. Use Bifrost.");
  const signup = async () => console.warn("Signup is deprecated. Use Bifrost.");
  const login = async () => console.warn("Login is deprecated. Use Bifrost.");

  return (
    <AuthContext.Provider value={{
        user,
        loading,
        loginWithToken,
        logout,
        // Keep these for backward compatibility during refactor, but they do nothing now
        login,
        signup,
        sendOtp
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);