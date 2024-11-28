import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { payment as PaymentApi, course as CourseApi } from "../services";

export const useCourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const payment = await PaymentApi.getCoursePayment(id);

                // Determine which API method to use based on payment status
                const fetchMethod = payment.status === "completed"
                    ? CourseApi.getCourseById
                    : CourseApi.getPreviewById;

                try {
                    const courseData = await fetchMethod(id);

                    if (!courseData) {
                        throw new Error("No course data available");
                    }

                    setCourse(courseData);
                } catch (fetchError) {
                    // Attempt to fetch preview if full course fails
                    if (fetchError.response?.status === 404) {
                        try {
                            const previewData = await CourseApi.getPreviewById(id);
                            setCourse(previewData);
                        } catch (previewError) {
                            setError("Unable to fetch course details");
                            setCourse(null);
                        }
                    } else {
                        setError("Failed to retrieve course information");
                        setCourse(null);
                    }
                }
            } catch (paymentError) {
                setError("Unable to verify course payment status");
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    return { course, loading, error };
};