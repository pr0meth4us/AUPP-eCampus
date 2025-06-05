// src/components/ErrorPage.jsx

import React from 'react';
import {
    XCircle,        // for 403
    AlertTriangle,  // for 404 (or general warning)
    AlertCircle     // for any other generic error
} from 'lucide-react';

const ErrorPage = ({ code = 500, message }) => {
    /**
     * code: number (e.g. 403, 404, 500, etc.)
     * message: optional custom message (falls back to default below)
     */

        // Decide icon, title, and default description based on code
    let IconComponent, titleText, descriptionText;

    switch (code) {
        case 403:
            IconComponent = XCircle;
            titleText = '403 – Unauthorized';
            descriptionText =
                message ||
                'You do not have permission to access this page. If you believe this is in error, please contact support.';
            break;

        case 404:
            IconComponent = AlertTriangle;
            titleText = '404 – Page Not Found';
            descriptionText =
                message ||
                "Sorry, the page you’re looking for doesn’t exist. Check the URL or go back to the homepage.";
            break;

        default:
            IconComponent = AlertCircle;
            titleText = `${code} – Something Went Wrong`;
            descriptionText =
                message ||
                'An unexpected error occurred. Please try again later or reach out to support if the problem persists.';
            break;
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <IconComponent className="w-16 h-16 text-red-500" />

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-red-500">{titleText}</h1>
                        <p className="text-gray-600">{descriptionText}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Go Back to Home
                        </button>
                        {/* If you want a “Contact Support” button, uncomment below */}
                        {/*
            <button
              onClick={() => (window.location.href = '/contact')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              Contact Support
            </button>
            */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
