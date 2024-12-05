import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { payment as PaymentApi, course as CourseApi } from "../services";

export const  useCourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            const courseData = await CourseApi.getCourseById(id);
            setCourse(courseData);
            setError(null);
            setLoading(false);
        };

        if (id) {
            fetchCourseData(); // Fetch course data when the component is mounted or `id` changes
        }
    }, [id]);

    return { course, loading, error };
};
