import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/elements/login.css';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-40 w-60 h-60 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                    }}
                ></div>
            ))}

            {/* Main login card */}
            <div className="relative w-full max-w-md">
                {/* Glassmorphism card */}
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>

                    <div className="relative z-10">
                        {/* Header with logo/icon */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                            <p className="text-white/70">Sign in to continue your learning journey</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-white/90 text-sm font-semibold mb-3">Login as</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('student')}
                                        className={`relative py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                                            role === 'student'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                                : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/20'
                                        }`}
                                    >
                                        <span className="relative z-10 capitalize">Student</span>
                                        {role === 'student' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl animate-pulse opacity-20"></div>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('instructor')}
                                        className={`relative py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                                            role === 'instructor'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                                : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/20'
                                        }`}
                                    >
                                        <span className="relative z-10 capitalize">Instructor</span>
                                        {role === 'instructor' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl animate-pulse opacity-20"></div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="loginEmail" className="block text-white/90 text-sm font-semibold">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        ref={firstInputRef}
                                        type="email"
                                        id="loginEmail"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="loginPassword" className="block text-white/90 text-sm font-semibold">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="loginPassword"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="text-right">
                                    <a
                                        href="/forgot-password"
                                        className="text-sm text-white/70 hover:text-white transition-colors duration-300 hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* reCAPTCHA */}
                            <div className="flex justify-center">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <Recaptcha onVerify={setCaptchaValue} />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                                    <p className="text-red-200 text-sm text-center">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-center text-white/70">
                                New to eCampus?{' '}
                                <a
                                    href="/register"
                                    className="text-white font-semibold hover:text-blue-300 transition-colors duration-300 hover:underline"
                                >
                                    Register Now
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;