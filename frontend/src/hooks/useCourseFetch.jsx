import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { course as CourseApi } from "../services";

export const useCourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const courseData = await CourseApi.getDetailsById(id);

                if (!courseData) {
                    throw new Error("Course data not found");
                }

                setCourse(courseData);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch course data:", error);
                setError(error);
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseData();
        }
    }, [id]);

    return {
        course,
        loading,
        error,
        courseId: id
    };
};