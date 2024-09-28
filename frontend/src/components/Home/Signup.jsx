import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Recaptcha from '../Recaptcha';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const { signup, sendOtp } = useAuth();

    const handleSendOtp = async () => {
        setIsLoading(true);
        setError('');
        try {
            await sendOtp(email);
            setOtpSent(true);
        } catch (err) {
            setError(err.response.data.message);
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
            await signup(name, email, password, "student", verificationCode, captchaValue);
            navigate('/');
        } catch (err) {
            setError(err.response.data.message);
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
                                    disabled={otpSent || isLoading}
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
                                <p className="small text-muted">
                                    We've sent a verification code to your email. Please enter it below to continue.
                                </p>
                            )}

                            {otpSent && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                                        <input
                                            type="text"
                                            id="verificationCode"
                                            className="form-control"
                                            placeholder="Enter Verification Code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            placeholder="Name"
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
                                    <div className="mb-3">
                                        <Recaptcha onVerify={setCaptchaValue} />
                                    </div>
                                </>
                            )}
                            {error && <p className="text-danger">{error}</p>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        {otpSent && (
                            <button type="button" className="btn btn-primary" onClick={handleSignup} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Signup'
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
