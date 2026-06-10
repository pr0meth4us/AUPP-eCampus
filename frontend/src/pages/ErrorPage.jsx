import React from 'react';
import {
    XCircle,        // for 403
    AlertTriangle,  // for 404 (or general warning)
    AlertCircle,    // for any other generic error
} from 'lucide-react';

const ErrorPage = ({ code = 500, message, type }) => {
    /**
     * code: number (e.g. 403, 404, 500, etc.)
     * message: optional custom message (falls back to default below)
     * type: 'construction' for under construction page
     */

    // Handle under construction type
    if (type === 'construction') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main content */}
                <div className="relative z-10 text-center px-6 max-w-2xl">
                    {/* Construction icon with animation */}
                    <div className="mb-8 relative">
                        <div className="text-8xl animate-bounce">🚧</div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>

                    {/* Main heading with gradient text */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                        <span className="text-4xl md:text-5xl">Coming Soon</span>
                    </h1>

                    {/* Call to action */}
                    <div className="space-y-4">
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                        >
                            <span className="relative">Back to Home</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
        );
    }

    // Decide icon, title, and default description based on code
    let IconComponent, titleText, descriptionText, bgColor, iconColor, titleColor;

    switch (code) {
        case 403:
            IconComponent = XCircle;
            titleText = '403 – Unauthorized';
            descriptionText =
                message ||
                'You do not have permission to access this page. If you believe this is in error, please contact support.';
            bgColor = 'from-red-50 to-rose-50';
            iconColor = 'text-red-500';
            titleColor = 'text-red-600';
            break;

        case 404:
            IconComponent = AlertTriangle;
            titleText = '404 – Page Not Found';
            descriptionText =
                message ||
                "Sorry, the page you're looking for doesn't exist. Check the URL or go back to the homepage.";
            bgColor = 'from-orange-50 to-amber-50';
            iconColor = 'text-orange-500';
            titleColor = 'text-orange-600';
            break;

        default:
            IconComponent = AlertCircle;
            titleText = `${code} – Something Went Wrong`;
            descriptionText =
                message ||
                'An unexpected error occurred. Please try again later or reach out to support if the problem persists.';
            bgColor = 'from-slate-50 to-gray-50';
            iconColor = 'text-slate-500';
            titleColor = 'text-slate-600';
            break;
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br ${bgColor} p-4 relative overflow-hidden`}>
            {/* Subtle background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-current rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-current rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon with pulse animation */}
                    <div className="relative">
                        <IconComponent className={`w-16 h-16 ${iconColor} animate-pulse`} />
                        <div className={`absolute inset-0 w-16 h-16 ${iconColor} opacity-20 animate-ping rounded-full`}></div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <h1 className={`text-3xl font-bold ${titleColor}`}>{titleText}</h1>
                        <p className="text-gray-600 leading-relaxed">{descriptionText}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            Go Back to Home
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;