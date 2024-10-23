import { useAuth } from '../../context/authContext';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";

const AdminLogin = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await login(email, password, "admin");
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div css={{ mw: "400px", p: "$10" }}>
                <div className="h3 text-center">Admin Login</div>
                <Spacer y={1} />
                <Input
                    clearable
                    bordered
                    fullWidth
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    status={error ? 'error' : 'default'}
                />
                <Spacer y={1.5} />
                <Input
                    clearable
                    bordered
                    fullWidth
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    status={error ? 'error' : 'default'}
                />
                <Spacer y={1.5} />
                {error && <p color="error">{error}</p>}
                <Spacer y={1} />
                <Button shadow color="primary" auto onClick={handleLogin}>
                    Login
                </Button>
            </div>
        </div>
    );
};

export default AdminLogin;
