import React from 'react';
import { XCircle } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Error Icon */}
                    <XCircle className="w-16 h-16 text-red-500" />

                    {/* Error Title */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-red-500">
                            403 - Unauthorized
                        </h1>
                        <p className="text-gray-600">
                            You do not have permission to access this page. If this is a mistake, please contact support.
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        onClick={() => window.location.href = '/'}
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;