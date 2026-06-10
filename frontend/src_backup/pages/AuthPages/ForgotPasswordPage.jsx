import React, { useState, useEffect } from 'react';
import { Button, Input, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/auth"; // Direct import to avoid context loop if user is null
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const [proofToken, setProofToken] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    // --- TIMERS ---
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // --- HANDLERS ---

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await auth.sendOtp(email);
            if (data.verification_id) {
                setVerificationId(data.verification_id);
                setStep(2);
                setResendTimer(60);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send verification code.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await auth.verifyOtp(verificationId, verificationCode);
            if (data.proof_token) {
                setProofToken(data.proof_token);
                setStep(3);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Invalid verification code.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await auth.resetPassword(proofToken, newPassword);
            setStep(4); // Success state
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">

                {/* Header (Hidden on Success step for cleaner look) */}
                {step !== 4 && (
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {step === 1 && "Enter your email to receive a verification code"}
                            {step === 2 && `Enter the code sent to ${email}`}
                            {step === 3 && "Create a new password for your account"}
                        </p>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* --- STEP 1: EMAIL --- */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            variant="bordered"
                            value={email}
                            onValueChange={setEmail}
                            isRequired
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-bold"
                            isLoading={isLoading}
                        >
                            Send Code
                        </Button>
                        <div className="text-center">
                            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                                <ArrowLeftIcon className="w-4 h-4 mr-1 inline" /> Back to Login
                            </Link>
                        </div>
                    </form>
                )}

                {/* --- STEP 2: OTP --- */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <Input
                            label="Verification Code"
                            placeholder="Enter 6-digit code"
                            variant="bordered"
                            value={verificationCode}
                            onValueChange={setVerificationCode}
                            maxLength={6}
                            isRequired
                            classNames={{ input: "text-center tracking-[0.5em] font-mono text-lg" }}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-bold"
                            isLoading={isLoading}
                        >
                            Verify Code
                        </Button>

                        <div className="text-center space-y-2">
                            <button
                                type="button"
                                onClick={handleSendOtp} // Reuse send logic for resend
                                disabled={resendTimer > 0 || isLoading}
                                className={`text-sm ${resendTimer > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                            </button>
                            <div className="block">
                                <Link
                                    className="text-sm text-gray-500 cursor-pointer"
                                    onPress={() => setStep(1)}
                                >
                                    Change Email
                                </Link>
                            </div>
                        </div>
                    </form>
                )}

                {/* --- STEP 3: NEW PASSWORD --- */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <Input
                            type="password"
                            label="New Password"
                            placeholder="Enter new password"
                            variant="bordered"
                            value={newPassword}
                            onValueChange={setNewPassword}
                            isRequired
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-bold"
                            isLoading={isLoading}
                        >
                            Reset Password
                        </Button>
                    </form>
                )}

                {/* --- STEP 4: SUCCESS --- */}
                {step === 4 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h2>
                        <p className="text-gray-600 mb-8">
                            Your password has been successfully updated. You can now log in with your new credentials.
                        </p>
                        <Button
                            color="primary"
                            className="w-full font-bold"
                            onPress={() => navigate('/login')}
                        >
                            Go to Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;