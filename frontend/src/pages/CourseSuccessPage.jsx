import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payment, course } from "../services";

const CourseSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get("paymentId");
    const token = queryParams.get("token");
    const payerId = queryParams.get("PayerID");
    const courseId = queryParams.get("courseID");

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            const paymentData = await payment.paymentSuccess(token, paymentId, payerId);
            await course.enrollStudent(courseId);
            navigate("/course/confirmation", {
                state: {
                    receipt: paymentData.receipt,
                    paymentId: paymentData.payment_id,
                    courseId:courseId
                }
            });
        };
        handlePaymentSuccess();
    }, [paymentId, token, payerId, courseId, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-xl font-bold text-gray-700">Processing your payment...</h2>
            <p className="text-gray-500 mt-2">Please do not close this window.</p>
        </div>
    );
};

export default CourseSuccessPage;