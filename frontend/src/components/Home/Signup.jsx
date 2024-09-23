import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {register} from "../../services/api";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [name, setName]= useState("");

    const handleSignup = async () => {
        try {
            await register(name, email, password, "student");
            navigate('/');
        } catch (err) {
            setError('Sign up failed.');
        }
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
                            handleSignup().then(null);
                        }}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Name</label>
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
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSignup}>Signup</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
