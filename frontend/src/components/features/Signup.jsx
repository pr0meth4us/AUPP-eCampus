import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Recaptcha from "./Recaptcha";
import {useAuth} from "context/authContext";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('student');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { signup, sendOtp } = useAuth();

    // Countdown timer for resend button
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(timer => {
                    if (timer <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return timer - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    const startResendTimer = () => {
        setResendTimer(60);
        setCanResend(false);
    };

    const handleSendOtp = async () => {
        setIsLoading(true);
        setError('');

        // Check if user selected instructor
        if (userType === 'instructor') {
            setError('Instructor accounts are created by administrators only. Please contact auppecampus@icloud.com for instructor access.');
            setIsLoading(false);
            return;
        }

        try {
            await sendOtp(email);
            setOtpSent(true);
            startResendTimer();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification code');
        }
        setIsLoading(false);
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setIsLoading(true);
        setError('');
        try {
            await sendOtp(email);
            startResendTimer();
            setError(''); // Clear any previous errors
            // Show success message temporarily
            const successMsg = 'Verification code resent successfully!';
            setError(''); // This will be replaced with a success state if you want
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification code');
        }
        setIsLoading(false);
    };

    const handleSignup = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!captchaValue) {
                setError("Please complete the reCAPTCHA.");
                setIsLoading(false);
                return;
            }
            await signup(name, email, password, userType, verificationCode, captchaValue);

            // Redirect to the previous page or the home page if no referrer
            const from = location.state?.from || "/";
            navigate(from);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="modal fade" id="signup" tabIndex="-1" aria-labelledby="signup" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header color-primary border-bottom-0 d-flex justify-content-between align-items-center w-100">
                        <div className="text-center flex-grow-1">
                            <h2 className="modal-title" id="signup">Sign Up</h2>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!otpSent) {
                                handleSendOtp();
                            } else {
                                handleSignup();
                            }
                        }}>
                            {/* User Type Selection */}
                            {!otpSent && (
                                <div className="mb-3">
                                    <label className="form-label">I am a:</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="userType"
                                                id="student"
                                                value="student"
                                                checked={userType === 'student'}
                                                onChange={(e) => setUserType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="student">
                                                Student
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="userType"
                                                id="instructor"
                                                value="instructor"
                                                checked={userType === 'instructor'}
                                                onChange={(e) => setUserType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="instructor">
                                                Instructor
                                            </label>
                                        </div>
                                    </div>
                                    {userType === 'instructor' && (
                                        <div className="alert alert-info mt-2" role="alert">
                                            <small>
                                                <strong>Note:</strong> Instructor accounts are created by administrators.
                                                Please contact <strong>auppecampus@icloud.com</strong> to request instructor access.
                                            </small>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-3 d-flex align-items-center">
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={otpSent}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleSendOtp}
                                    disabled={otpSent || isLoading || userType === 'instructor'}
                                    style={{ width: "40%" }}
                                >
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        otpSent ? "Code Sent" : "Next"
                                    )}
                                </button>
                            </div>

                            {otpSent && (
                                <>
                                    <div className="alert alert-success" role="alert">
                                        <small>
                                            📧 We've sent a verification code to <strong>{email}</strong>.
                                            Please check your inbox and enter the code below.
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="verificationCode" className="form-label">Verification
                                            Code</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                id="verificationCode"
                                                className="form-control me-2"
                                                placeholder="Enter 6-digit code"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                maxLength="6"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={`btn btn-outline-secondary ${!canResend ? 'disabled' : ''}`}
                                                onClick={handleResendOtp}
                                                disabled={!canResend || isLoading}
                                                style={{minWidth: '100px'}}
                                            >
                                                {isLoading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status"
                                                          aria-hidden="true"></span>
                                                ) : canResend ? (
                                                    'Resend'
                                                ) : (
                                                    `${resendTimer}s`
                                                )}
                                            </button>
                                        </div>
                                        {!canResend && resendTimer > 0 && (
                                            <small className="text-muted">
                                                You can resend the code in {resendTimer} seconds
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-white/60 italic">
                                        (Just ignore reCAPTCHA — it’s boring, so I disabled it.)
                                    </p>
                                    <div className="mb-3">
                                        <Recaptcha onVerify={setCaptchaValue}/>
                                    </div>
                                </>
                            )}
                            {error && (
                                <div className={`alert ${error.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        {otpSent && (
                            <button type="button" className="btn btn-primary" onClick={handleSignup} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;