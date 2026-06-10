import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login(email, password, "student", "mock_turnstile_token");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 bg-brutal-bg">
            <div className="w-full max-w-md bg-white border-8 border-brutal-black shadow-brutal p-8 brutal-card relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-brutal-yellow border-4 border-brutal-black z-10 shadow-brutal"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-brutal-blue border-4 border-brutal-black z-10 shadow-brutal"></div>

                <div className="mb-8">
                    <Link to="/" className="inline-block font-bold uppercase tracking-widest text-sm border-b-4 border-brutal-black hover:bg-brutal-black hover:text-white transition-colors mb-6">
                        ← Back to ED/CORE
                    </Link>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">
                        System Login
                    </h1>
                    <p className="text-xl font-bold bg-brutal-yellow inline-block px-2 border-2 border-brutal-black mt-2">
                        AUTHORIZED PERSONNEL ONLY.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-brutal-red text-white font-bold p-4 border-4 border-brutal-black shadow-brutal animate-shake">
                            ERROR: {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="block font-black uppercase tracking-wider text-lg">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="STUDENT@AUPP.EDU.KH"
                            className="w-full p-4 font-bold text-lg border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg uppercase placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block font-black uppercase tracking-wider text-lg">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 font-bold text-lg border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Link to="/forgot-password" className="font-bold text-lg hover:underline decoration-4 underline-offset-4 decoration-brutal-red">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brutal-blue text-white text-xl disabled:bg-gray-400 brutal-button mt-4"
                    >
                        {isLoading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t-8 border-brutal-black text-center">
                    <p className="font-bold text-lg">
                        NO ACCOUNT?{" "}
                        <Link to="/signup" className="text-brutal-blue hover:text-white hover:bg-brutal-blue px-2 underline decoration-4 underline-offset-4 transition-colors">
                            INITIATE SIGNUP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
