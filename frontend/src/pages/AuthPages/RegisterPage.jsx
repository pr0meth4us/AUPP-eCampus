import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Recaptcha from "../../components/features/Recaptcha";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { signup, sendOtp } = useAuth();
    const emailInputRef = useRef(null);

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await sendOtp(email);
            setOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification code');
        }
        setIsLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (!captchaValue) {
                setError("Please complete the reCAPTCHA.");
                setIsLoading(false);
                return;
            }
            await signup(name, email, password, "student", verificationCode, captchaValue);

            const from = location.state?.from || "/";
            navigate(from);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-40 w-60 h-60 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            {/* Main registration card */}
            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-white/70">Join eCampus to start your learning journey</p>
                        </div>

                        {/* Step 1: Email verification */}
                        {!otpSent ? (
                            <div onSubmit={handleSendOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-white/90 text-sm font-medium">
                                        Email Address
                                    </label>
                                    <input
                                        ref={emailInputRef}
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                                        <p className="text-red-200 text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending Code...</span>
                                        </div>
                                    ) : (
                                        'Send Verification Code'
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* Step 2: Complete registration */
                            <div onSubmit={handleSignup} className="space-y-6">
                                {/* Success message */}
                                <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                                    <p className="text-blue-200 text-sm">
                                        Verification code sent to <strong>{email}</strong>
                                    </p>
                                </div>

                                {/* Verification Code */}
                                <div className="space-y-2">
                                    <label htmlFor="verificationCode" className="block text-white/90 text-sm font-medium">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="verificationCode"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center tracking-widest"
                                        placeholder="Enter 6-digit code"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        maxLength="6"
                                        required
                                    />
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-white/90 text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-white/90 text-sm font-medium">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* reCAPTCHA */}
                                <div className="flex justify-center">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <Recaptcha onVerify={setCaptchaValue} />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                                        <p className="text-red-200 text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setOtpSent(false)}
                                        className="flex-1 py-3 bg-white/5 text-white/80 font-medium rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSignup}
                                        disabled={isLoading}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer Links */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-center text-white/70">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200"
                                >
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;