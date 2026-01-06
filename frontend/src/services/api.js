import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    withCredentials: true, // MANDATORY for HttpOnly Cookies
    headers: {
        'Content-Type': 'application/json',
    }
});

// Remove the old interceptor that was manually attaching 
// localStorage tokens. The browser does this automatically now.
export default api;