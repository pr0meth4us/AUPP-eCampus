import React, { useState, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const closeButtonRef = useRef(null);
    const handleLogin = async () => {
        try {
            if (!role) {
                setError('Please select a role.');
                return;
            }
            await login(email, password, role);

            closeButtonRef.current.click();

            navigate(role === 'admin' ? '/admin/dashboard' : '/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };
    return (
        <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="login" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="login">
                            <i className="bi bi-exclamation-circle left me-2"></i>Login
                        </h3>
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
                                        className={`btn ${role === 'professor' ? 'btn-primary' : 'btn-outline-primary'} w-50`}
                                        onClick={() => setRole('professor')}
                                    >
                                        Professor
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

                            {error && <p className="text-danger">{error}</p>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" ref={closeButtonRef} >Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

