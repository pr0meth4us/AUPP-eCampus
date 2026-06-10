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
            setLoading(true);
            setError(null);

            const fetcher = {
                preview: CourseApi.getPreviewById,
                detail:  CourseApi.getDetailById,
                full:    CourseApi.getFullById,
            }[mode];

            if (!fetcher) {
                setError(new Error(`Invalid mode: ${mode}`));
                setLoading(false);
                return;
            }

            try {
                const data = await fetcher(id);
                setCourse(data);
            } catch (err) {
                const status = err.response?.status;
                if (mode === "detail" && status === 403) {
                    // detail forbidden → silent fallback to preview
                    try {
                        const previewData = await CourseApi.getPreviewById(id);
                        setCourse(previewData);
                        // note: we do NOT call setError here
                    } catch (previewErr) {
                        setError(previewErr);
                        setCourse(null);
                    }
                } else {
                    setError(err);
                    setCourse(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, mode]);

    return { course, loading, error };
};
