import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const { login } = useAuth(); // Assuming you want to use this function
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(''); // State for reCAPTCHA token
    const navigate = useNavigate();
    const closeButtonRef = useRef(null);

    // Load reCAPTCHA script when the component mounts
    useEffect(() => {
        const loadRecaptchaScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };

        loadRecaptchaScript();
    }, []);

    // Handle the reCAPTCHA success
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token); // Update the state with the reCAPTCHA token
    };

    const handleLogin = async () => {
        try {
            if (!role) {
                setError('Please select a role.');
                return;
            }

            if (!recaptchaToken) {
                setError('Please complete the reCAPTCHA.');
                return;
            }

            // You can use the login function if it's set up to handle the API call
            const response = await login(email, password, role, recaptchaToken); // Update this line as per your login logic

            // Handle success response
            console.log('Login successful:', response.data);
            closeButtonRef.current.click(); // Close modal on successful login
            navigate(role === 'admin' ? '/admin/dashboard' : '/'); // Redirect based on role

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
                            handleLogin();
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

                            {/* reCAPTCHA widget */}
                            <div className="g-recaptcha" data-sitekey="6LfdwUoqAAAAAL386KbkUWdJ2OG7GRNeaYj_DvhN" data-callback={handleRecaptchaChange}></div>
                            {error && <p className="text-danger">{error}</p>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" ref={closeButtonRef}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;