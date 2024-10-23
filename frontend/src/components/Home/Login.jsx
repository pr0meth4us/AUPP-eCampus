import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Recaptcha from '../Recaptcha';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const closeButtonRef = useRef(null);

    const handleLogin = async () => {
        try {
            if (!role) {
                setError('Please select a role.');
                return;
            }
            if (!captchaValue) {
                setError('Please complete the reCAPTCHA.');
                return;
            }
            await login(email, password, role, captchaValue);
            closeButtonRef.current.click();
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="login" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header color-primary border-bottom-0 d-flex justify-content-between align-items-center w-100">
                        <div className="text-center flex-grow-1">
                            <h2 className="modal-title" id="login">Welcome Back!</h2>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin().then(null);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Login as</label>
                                <div className="d-flex gap-4">
                                    <button
                                        type="button"
                                        className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline-primary'} w-50 `}
                                        onClick={() => setRole('student')}
                                    >
                                        Student
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${role === 'instructor' ? 'btn-primary' : 'btn-outline-primary'} w-50`}
                                        onClick={() => setRole('instructor')}
                                    >
                                        Instructor
                                    </button>

                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <Recaptcha onVerify={setCaptchaValue} />
                            {error && <p className="text-danger">{error}</p>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" ref={closeButtonRef} data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
