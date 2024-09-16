import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../middleware/AuthContext";
import {API_BASE_URL} from "../config";

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const { handleRoleChange } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password , role}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            const { role } = data;
            handleRoleChange(role);
            navigate(role === 'admin' ? '/admin/dashboard' : '/');
        } else {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                type="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
}

export default Signin;
