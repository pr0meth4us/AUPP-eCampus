import React from "react";

const ErrorMessage = ({ message = "An error occurred. Please try again later." }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-600/80">{message}</p>
        </div>
    </div>
);

export default ErrorMessage;
