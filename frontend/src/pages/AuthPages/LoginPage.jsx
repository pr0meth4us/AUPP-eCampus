import React, { useState } from 'react';
import { Button, Input, Link } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);

            // Redirect after successful login
            const from = location.state?.from || "/";
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <img
                        src="/aupp_ecampus_logo.png"
                        alt="AUPP Logo"
                        className="w-20 h-20 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to continue to eCampus</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        value={email}
                        onValueChange={setEmail}
                        isRequired
                        classNames={{
                            label: "text-black/50 dark:text-white/90",
                            input: [
                                "bg-transparent",
                                "text-black/90 dark:text-white/90",
                                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                            ],
                            inputWrapper: [
                                "shadow-xl",
                                "bg-default-200/50",
                                "dark:bg-default/60",
                                "backdrop-blur-xl",
                                "backdrop-saturate-200",
                                "hover:bg-default-200/70",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=true]:bg-default-200/50",
                                "dark:group-data-[focus=true]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                    />

                    <div className="space-y-1">
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            variant="bordered"
                            value={password}
                            onValueChange={setPassword}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="text-2xl text-default-400 pointer-events-none w-5 h-5" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            isRequired
                        />
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        color="primary"
                        className="w-full font-bold shadow-lg"
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;