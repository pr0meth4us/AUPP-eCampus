import React, { useState } from "react";
import {
    Card, CardHeader, CardBody, CardFooter,
    Input, Button, Checkbox, Link, Divider
} from "@heroui/react";
import { Mail, Lock, LogIn, ChevronLeft } from "lucide-react";
import { useAuth } from "context/authContext";
import { useNavigate } from "react-router-dom";

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
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50/50">
            <Card className="w-full max-w-[400px] p-4 shadow-2xl">
                <CardHeader className="flex flex-col gap-1 items-start">
                    <Link
                        href="/"
                        className="text-default-400 text-sm mb-4 flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-default-500 text-sm">Enter your credentials to access your courses</p>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-danger-50 text-danger text-xs p-3 rounded-lg border border-danger-100">
                                {error}
                            </div>
                        )}
                        <Input
                            isRequired
                            type="email"
                            label="Email"
                            placeholder="you@aupp.edu.kh"
                            variant="bordered"
                            labelPlacement="outside"
                            startContent={<Mail className="text-default-400" size={18}/>}
                            value={email}
                            onValueChange={setEmail}
                        />
                        <Input
                            isRequired
                            type="password"
                            label="Password"
                            placeholder="********"
                            variant="bordered"
                            labelPlacement="outside"
                            startContent={<Lock className="text-default-400" size={18}/>}
                            value={password}
                            onValueChange={setPassword}
                        />
                        <div className="flex justify-between items-center px-1">
                            <Checkbox size="sm">Remember me</Checkbox>
                            <Link href="/forgot-password" size="sm" className="text-primary">
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-bold mt-2"
                            isLoading={isLoading}
                            startContent={!isLoading && <LogIn size={18}/>}
                        >
                            Sign In
                        </Button>
                    </form>
                </CardBody>

                <Divider className="my-4" />

                <CardFooter className="flex flex-col gap-4">
                    <p className="text-sm text-center text-default-500">
                        Don't have an account?{" "}
                        <Link href="/register" size="sm" className="font-bold">
                            Create Account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;