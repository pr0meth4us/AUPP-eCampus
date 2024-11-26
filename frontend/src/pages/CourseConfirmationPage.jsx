import React from "react";
import { useLocation, Link } from "react-router-dom";

const CourseConfirmationPage = () => {
    const location = useLocation();
    const receipt = location.state?.receipt; // Access receipt from state
    const courseId = location.state?.courseId; // Access courseId from state

    if (!receipt) {
        return <p>Error: No receipt found</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="bg-gray-50 p-8 shadow-lg rounded-lg w-full max-w-3xl">
                <div className="flex justify-between items-center">
                    <div>
                        <img
                            src="/path/to/logo.png"
                            alt="Company Logo"
                            className="h-20 mb-4"
                        />
                        <h2 className="text-lg font-bold">Your Company Name</h2>
                        <p>123 Business St, City, Country</p>
                        <p>+1 (123) 456-7890</p>
                        <p>email@company.com</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-2xl font-bold">INVOICE</h3>
                        <p><strong>Receipt ID:</strong> {receipt["Receipt ID"]}</p>
                        <p><strong>Date:</strong> {receipt.Date}</p>
                    </div>
                </div>

                {/* Receipt Details Section */}
                <div className="my-6">
                    <h4 className="font-bold">Payment Details:</h4>
                    <p><strong>Status:</strong> {receipt.Status}</p>
                    <p><strong>Price:</strong> {receipt.Price} {receipt.Currency}</p>
                </div>

                {/* Transaction Details */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-2">Course Purchase</td>
                            <td className="px-4 py-2">${receipt.Price}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className="my-4 text-right">
                    <p className="font-bold">Total Paid: ${receipt.Price}</p>
                </div>

                {/* Transaction Link */}
                <div className="my-4">
                    <p>
                        <a
                            href={receipt["Approval URL"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            View Transaction on PayPal
                        </a>
                    </p>
                </div>

                {/* Link to Course */}
                {courseId && (
                    <div className="my-4">
                        <Link
                            to={`/course/${courseId}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                        >
                            Start Studying
                        </Link>
                    </div>
                )}

                {/* Notes Section */}
                <div className="my-2">
                    <p>Thank you for your purchase!</p>
                    <p>If you have any questions, contact us at support@company.com.</p>
                </div>
            </div>
        </div>
    );
};

export default CourseConfirmationPage;
