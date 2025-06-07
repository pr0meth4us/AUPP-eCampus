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
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setLoading(false);
          return;
        }

        // Check authentication (returns basic user info)
        const data = await auth.checkAuth();
        if (data.authenticated && data.user) {
          // Fetch full profile details
          const profile = await userService.getProfile(data.user._id);
          const merged = { ...data.user, ...profile };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
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

  const login = async (email, password, role, recaptchaResponse) => {
    const data = await auth.login(email, password, role, recaptchaResponse);
    localStorage.setItem('token', data.token);
    console.log(data.token, "kdmv")

    if (data.user) {
      // After obtaining basic user, fetch full profile
      const profile = await userService.getProfile(data.user._id);
      const merged = { ...data.user, ...profile };
      setUser(merged);

      localStorage.setItem('user', JSON.stringify(merged));
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
        const profile = await userService.getProfile(data.user._id);
        const merged = { ...data.user, ...profile };
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));
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
