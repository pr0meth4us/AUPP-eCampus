import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services';

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

        // Check authentication validity
        const data = await auth.checkAuth();
        if (data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          await logout();
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- ACTIONS ---

  // 1. Login via Token (from Bifrost or local storage)
  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);
    try {
      const data = await auth.syncSession(token);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (e) {
      console.error("Sync session failed", e);
      throw e;
    }
  };

  // 2. Standard Login (Email/Pass)
  const login = async (email, password) => {
    try {
      const data = await auth.login(email, password);
      if (data.jwt) {
        await loginWithToken(data.jwt);
      }
      return data;
    } catch (e) {
      throw e;
    }
  };

  // 3. Logout
  const logout = async () => {
    try {
      await auth.logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Optional: Redirect to home or refresh
    // window.location.href = '/';
  };

  // --- EXPOSE DIRECT SERVICE METHODS ---
  // These pass through directly to the auth service so components can use them
  const sendOtp = auth.sendOtp;
  const verifyOtp = auth.verifyOtp;
  const completeRegistration = async (proofToken, password, displayName) => {
    const data = await auth.completeRegistration(proofToken, password, displayName);
    if (data.jwt) {
      await loginWithToken(data.jwt);
    }
    return data;
  };
  const resetPassword = auth.resetPassword;

  return (
      <AuthContext.Provider value={{
        user,
        loading,
        login,
        logout,
        loginWithToken,
        // Expose the new Bifrost methods
        sendOtp,
        verifyOtp,
        completeRegistration,
        resetPassword,
        // Keep generic "signup" for compatibility if needed, aliased to nothing or a wrapper
        signup: (name, email, pass, role, code, captcha) => {
          console.warn("Please use completeRegistration flow.");
        }
      }}>
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);