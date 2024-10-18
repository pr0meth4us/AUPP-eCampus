import { useState } from 'react';
import { createCourse, updateCourse } from '../../services/api';

export const useCourseActions = (fetchData, setNotification) => {
    const [loading, setLoading] = useState(false);

    const handleCreateCourse = async (formData) => {
        setLoading(true);
        try {
            await createCourse(formData);
            setNotification({ message: 'Course created successfully!', type: 'success' });
            fetchData();
        } catch (error) {
            setNotification({ message: 'Failed to create course.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCourse = async (courseId, formData) => {
        setLoading(true);
        try {
            await updateCourse(courseId, formData);
            setNotification({ message: 'Course updated successfully!', type: 'success' });
            fetchData();
        } catch (error) {
            setNotification({ message: 'Failed to update course.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateCourse, handleUpdateCourse, loading };
};