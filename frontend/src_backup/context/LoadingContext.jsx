import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {loadingEmitter} from "services/api";
import Spinner from "components/common/Spinner";

export const LoadingContext = createContext({ loading: false });

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Listen to API loading events
  useEffect(() => {
    const handler = (e) => setLoading(e.detail);
    loadingEmitter.addEventListener('loading', handler);
    return () => loadingEmitter.removeEventListener('loading', handler);
  }, []);

  // Show loading on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {loading && <Spinner />}
      {children}
    </LoadingContext.Provider>
  );
}