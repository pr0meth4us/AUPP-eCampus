import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../services/api";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    console.log(name,email, password,token);

    const handleSignup = async () => {
        try {
            await register(name, email, password, "admin", token);
            navigate('/admin/dashboard');

        } catch (err) {
            setError('Registration failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={handleSignup}>Signup</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Signup;
