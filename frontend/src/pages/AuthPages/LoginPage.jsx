// src/pages/LoginPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/elements/login.css';
import {useAuth} from "../../context/authContext";
import Recaptcha from "../../components/features/Recaptcha";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const firstInputRef = useRef(null);

    // Save the previous path so we can redirect back after login
    useEffect(() => {
        if (location.pathname !== '/login') {
            localStorage.setItem('previousPath', location.pathname + location.search);
        }
        // Focus on the email input when page loads
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!role) {
                throw new Error('Please select a role.');
            }
            if (!captchaValue) {
                throw new Error('Please complete the reCAPTCHA.');
            }

            // Attempt login
            await login(email, password, role, captchaValue);

            // On success, redirect to previous or home
            const previousPath = localStorage.getItem('previousPath') || '/';
            localStorage.removeItem('previousPath');
            navigate(previousPath);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-sm" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card-body p-4">
                    {/* Header */}
                    <h2 className="card-title text-center mb-4" style={{ fontSize: '1.75rem' }}>
                        Welcome Back!
                    </h2>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        {/* Role Selection */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Login as</label>
                            <div className="d-flex gap-3">
                                <button
                                    type="button"
                                    className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
                                    onClick={() => setRole('student')}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${role === 'instructor' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
                                    onClick={() => setRole('instructor')}
                                >
                                    Instructor
                                </button>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">
                                Email
                            </label>
                            <input
                                ref={firstInputRef}
                                type="email"
                                id="loginEmail"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="loginPassword"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="mt-2">
                                <a href="/forgot-password" className="small">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* reCAPTCHA */}
                        <div className="mb-3">
                            <Recaptcha onVerify={setCaptchaValue} />
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-danger mb-3">{error}</p>}

                        {/* Submit Button */}
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <hr />
                    <p className="text-center mb-0">
                        New to eCampus?{' '}
                        <a href="/register" className="fw-medium">
                            Register Now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
