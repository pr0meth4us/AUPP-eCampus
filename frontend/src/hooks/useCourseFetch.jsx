// hooks/useCourseDetails.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { course as CourseApi } from "../services";

export const useCourseDetails = (mode = "detail") => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);

                const fetcher = {
                    preview: CourseApi.getPreviewById,
                    detail: CourseApi.getDetailById,
                    full: CourseApi.getFullById,
                }[mode];

                if (!fetcher) {
                    throw new Error(`Invalid mode: ${mode}`);
                }

                const data = await fetcher(id);
                setCourse(data);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError(err);
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, mode]);

    return { course, loading, error };
};