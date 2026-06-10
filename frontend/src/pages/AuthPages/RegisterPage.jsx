import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const RegisterPage = () => {
    const { sendOtp, verifyOtp, completeRegistration } = useAuth();
    const navigate = useNavigate();

    // Flow State
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form Data
    const [email, setEmail] = useState("");
    const [verificationId, setVerificationId] = useState("");
    const [code, setCode] = useState("");
    const [proofToken, setProofToken] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const data = await sendOtp(email);
            setVerificationId(data.verification_id);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const data = await verifyOtp(verificationId, code);
            setProofToken(data.proof_token);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await completeRegistration(proofToken, password, displayName, "mock_turnstile_token");
            navigate("/"); // Success! Redirect to home/dashboard
        } catch (err) {
            setError(err.response?.data?.message || "Failed to complete registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 bg-brutal-bg">
            <div className="w-full max-w-2xl bg-white border-8 border-brutal-black shadow-brutal p-8 brutal-card relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-brutal-red border-4 border-brutal-black z-10 shadow-brutal flex items-center justify-center font-black text-white text-xl">
                    {step}/3
                </div>

                <div className="mb-12">
                    <Link to="/" className="inline-block font-bold uppercase tracking-widest text-sm border-b-4 border-brutal-black hover:bg-brutal-black hover:text-white transition-colors mb-6">
                        ← Cancel Registration
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        System Onboarding
                    </h1>
                    <div className="flex gap-2 mt-4 h-4 w-full bg-gray-200 border-2 border-brutal-black">
                        <div className={`h-full border-r-2 border-brutal-black transition-all ${step >= 1 ? 'w-1/3 bg-brutal-yellow' : 'w-0'}`} />
                        <div className={`h-full border-r-2 border-brutal-black transition-all ${step >= 2 ? 'w-1/3 bg-brutal-blue' : 'w-0'}`} />
                        <div className={`h-full transition-all ${step === 3 ? 'w-1/3 bg-brutal-red' : 'w-0'}`} />
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-brutal-red text-white font-bold p-4 border-4 border-brutal-black shadow-brutal animate-shake">
                        ERROR: {error}
                    </div>
                )}

                {/* STEP 1: EMAIL */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in">
                        <div className="bg-brutal-yellow p-4 border-4 border-brutal-black font-bold mb-6">
                            STEP 1: IDENTITY VERIFICATION
                        </div>
                        <div className="space-y-2">
                            <label className="block font-black uppercase tracking-wider text-lg">Institution Email</label>
                            <input
                                required
                                type="email"
                                placeholder="STUDENT@AUPP.EDU.KH"
                                className="w-full p-4 font-bold text-lg border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg uppercase"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-brutal-black text-white text-xl disabled:bg-gray-400 brutal-button mt-8"
                        >
                            {isLoading ? "TRANSMITTING..." : "REQUEST OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
                        <div className="bg-brutal-blue text-white p-4 border-4 border-brutal-black font-bold mb-6">
                            STEP 2: OTP AUTHORIZATION
                        </div>
                        <p className="font-bold mb-4">An authorization code was sent to <span className="bg-brutal-yellow px-1 border-2 border-brutal-black">{email}</span></p>
                        
                        <div className="space-y-2">
                            <label className="block font-black uppercase tracking-wider text-lg">6-Digit Code</label>
                            <input
                                required
                                type="text"
                                placeholder="XXXXXX"
                                maxLength={6}
                                className="w-full p-4 font-black text-4xl tracking-widest text-center border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg uppercase"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-brutal-black text-white text-xl disabled:bg-gray-400 brutal-button mt-8"
                        >
                            {isLoading ? "VERIFYING..." : "VERIFY CODE"}
                        </button>
                    </form>
                )}

                {/* STEP 3: DETAILS */}
                {step === 3 && (
                    <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
                        <div className="bg-brutal-red text-white p-4 border-4 border-brutal-black font-bold mb-6">
                            STEP 3: PROFILE CREATION
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block font-black uppercase tracking-wider text-lg">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="JANE DOE"
                                    className="w-full p-4 font-bold text-lg border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg uppercase"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-black uppercase tracking-wider text-lg">Secure Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full p-4 font-bold text-lg border-4 border-brutal-black focus:outline-none focus:shadow-brutal transition-shadow bg-brutal-bg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-brutal-yellow text-brutal-black text-xl disabled:bg-gray-400 brutal-button mt-8"
                        >
                            {isLoading ? "INITIALIZING..." : "FINALIZE ONBOARDING"}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-8 border-t-8 border-brutal-black text-center">
                    <p className="font-bold text-lg">
                        ALREADY CLEARED?{" "}
                        <Link to="/login" className="text-brutal-blue hover:text-white hover:bg-brutal-blue px-2 underline decoration-4 underline-offset-4 transition-colors">
                            ENTER SYSTEM
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
