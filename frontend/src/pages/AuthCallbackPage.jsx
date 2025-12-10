import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Spinner } from "@nextui-org/react";

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const processLogin = async () => {
            const token = searchParams.get('token');
            if (!token) {
                console.error("No token found in URL");
                navigate('/login?error=no_token');
                return;
            }

            try {
                // Send the token to AUPP Backend to sync the user session
                await loginWithToken(token);
                // Redirect to dashboard or home
                navigate('/');
            } catch (err) {
                console.error("Login sync failed", err);
                navigate('/login?error=sync_failed');
            }
        };

        processLogin();
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-gray-600 font-medium">Authenticating with Bifrost...</p>
        </div>
    );
};

export default AuthCallbackPage;