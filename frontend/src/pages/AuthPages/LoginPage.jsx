import React from 'react';
import { Button } from "@nextui-org/react";

const LoginPage = () => {
    // HARDCODED BIFROST URL (Update this if your Bifrost URL is different)
    // IMPORTANT: matches the client_id you created in Bifrost Admin
    const BIFROST_URL = "https://objective-denna-auppecampus-9a7d86fc.koyeb.app/auth/ui/login";
    // This must match the Client ID you put in your Backend .env
    const CLIENT_ID = "aupp_ecampus_a1b2c3d4"; // REPLACE THIS WITH YOUR REAL BIFROST CLIENT ID

    const handleBifrostLogin = () => {
        window.location.href = `${BIFROST_URL}?client_id=${CLIENT_ID}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <img
                    src="/aupp_ecampus_logo.png"
                    alt="AUPP Logo"
                    className="w-20 h-20 mx-auto mb-6"
                />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to eCampus</h1>
                <p className="text-gray-600 mb-8">
                    We have updated our login system. Please sign in using your unified Bifrost ID.
                </p>

                <Button
                    size="lg"
                    color="primary"
                    className="w-full font-bold shadow-lg"
                    onPress={handleBifrostLogin}
                >
                    Sign In with Bifrost
                </Button>

                <p className="mt-4 text-xs text-gray-400">
                    Secure Identity Provider
                </p>
            </div>
        </div>
    );
};

export default LoginPage;