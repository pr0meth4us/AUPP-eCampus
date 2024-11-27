import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Calendar, CreditCard, DollarSign, Receipt, Info } from "lucide-react";

const CourseConfirmationPage = () => {
    const location = useLocation();
    const receipt = location.state?.receipt;
    const courseId = location.state?.courseId;

    if (!receipt) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <Info className="mx-auto text-red-500 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error: No Receipt Found
                    </h2>
                    <p className="text-gray-600">
                        Something went wrong with your transaction. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
                    <div>
                        <img
                            src="/AUPP-Main-Logo.svg"
                            alt="AUPP Logo"
                            className="h-16 mb-2  "
                        />
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold">Payment Receipt</h2>
                        <p className="text-blue-100">Transaction Confirmed</p>
                    </div>
                </div>

                {/* Receipt Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Left Column: Transaction Details */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <Receipt className="mr-2 text-blue-600" size={24} />
                            Transaction Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600 flex items-center">
                                    <Calendar className="mr-2 text-blue-500" size={20} />
                                    Date
                                </span>
                                <span>{receipt.Date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600 flex items-center">
                                    <CreditCard className="mr-2 text-blue-500" size={20} />
                                    Payment Method
                                </span>
                                <span>{receipt["Payment Method"]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600 flex items-center">
                                    <DollarSign className="mr-2 text-blue-500" size={20} />
                                    Transaction Type
                                </span>
                                <span>{receipt["Transaction Type"]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Summary */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <DollarSign className="mr-2 text-green-600" size={24} />
                            Payment Summary
                        </h3>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span>Course Price</span>
                                <span>{receipt.Price} {receipt.Currency}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transaction Fees</span>
                                <span>{receipt["Transaction Fees"]}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <span>Total Paid</span>
                                <span>
                                    {parseFloat(receipt.Price) + parseFloat(receipt["Transaction Fees"].split(' ')[0])} {receipt.Currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-100 p-6 grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Payment Identifiers</h4>
                        <p><strong>Receipt ID:</strong> {receipt["Receipt ID"]}</p>
                        <p><strong>PayPal Payment ID:</strong> {receipt["PayPal Payment ID"]}</p>
                        <p><strong>Payer ID:</strong> {receipt["Payer ID"]}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Course Information</h4>
                        <p><strong>Course ID:</strong> {receipt["Course ID"]}</p>
                        <p><strong>Status:</strong> {receipt.Status}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-white flex justify-between items-center border-t">
                    <a
                        href={receipt["Approval URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                    >
                        <Receipt className="mr-2" size={20} />
                        View Transaction on PayPal
                    </a>

                    {courseId && (
                        <Link
                            to={`/course/${courseId}`}
                            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition flex items-center"
                        >
                            Start Studying
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Footer Note */}
                <div className="bg-blue-50 text-center p-4 text-sm text-gray-600">
                    <p>Thank you for choosing AUPP. If you have any questions, please contact us at info@aupp.edu.kh.</p>
                </div>
            </div>
        </div>
    );
};

export default CourseConfirmationPage;