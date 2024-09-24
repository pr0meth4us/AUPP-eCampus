import { useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';   // ** New import

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');  // NEW
    const navigate = useNavigate();
<<<<<<< HEAD:frontend/src/components/Login.jsx

   
    const handleLogin = async (e) => {
        e.preventDefault();
=======
    const closeButtonRef = useRef(null);
    const handleLogin = async () => {
>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
        try {
            if (!role) {
                setError('Please select a role.');
                return;
            }
<<<<<<< HEAD:frontend/src/components/Login.jsx
    
            // Attempt login
            const response = await axios.post('/auth/login/student', {
                email,
                password,
                role,
                'g-recaptcha-response': recaptchaToken
            });
    
            // Use response to store the token
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                // Optionally call your login context function
                await login(email, password, role); 
                navigate(role === 'admin' ? '/admin/dashboard' : '/');
            }
=======
            await login(email, password, role);

            closeButtonRef.current.click();

            navigate(role === 'admin' ? '/admin/dashboard' : '/');
>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };
<<<<<<< HEAD:frontend/src/components/Login.jsx

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

=======
>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
    return (
        <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="login" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div
                        className="modal-header color-primary border-bottom-0 d-flex justify-content-between align-items-center w-100">
                        <div className="text-center flex-grow-1">
                            <h2 className="modal-title" id="login">Welcome Back!</h2>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleLogin}>
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
<<<<<<< HEAD:frontend/src/components/Login.jsx
                            <div className="g-recaptcha" data-sitekey="6LfdwUoqAAAAAL386KbkUWdJ2OG7GRNeaYj_DvhN" data-callback={handleRecaptchaChange}></div>
=======

>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
                            {error && <p className="text-danger">{error}</p>}
                        </form>
                    </div>
                    <div className="modal-footer">
<<<<<<< HEAD:frontend/src/components/Login.jsx
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" onClick={handleLogin}>Login</button>
=======
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" ref={closeButtonRef} >Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
                    </div>
                </div>
            </div>
        </div>
    );
};

<<<<<<< HEAD:frontend/src/components/Login.jsx
export default LoginPage;
=======
export default LoginPage;

>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9:frontend/src/components/Home/Login.jsx
