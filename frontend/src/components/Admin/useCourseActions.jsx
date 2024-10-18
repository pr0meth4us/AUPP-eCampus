import { useState } from 'react';
import { createCourse, updateCourse } from '../../services/api';

export const useCourseActions = (fetchData, setNotification) => {
    const [loading, setLoading] = useState(false);

    const handleCreateCourse = async (formData) => {
        setLoading(true);
        try {
            await createCourse(formData);
            fetchData();
            setNotification({ message: 'Course created successfully!', type: 'success' });
            return true;
        } catch (error) {
            setNotification({ message: 'Failed to create course.', type: 'error' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCourse = async (courseId, formData) => {
        setLoading(true);
        try {
            await updateCourse(courseId, formData);
            fetchData();
            setNotification({ message: 'Course updated successfully!', type: 'success' });
            return true;
        } catch (error) {
            setNotification({ message: 'Failed to update course.', type: 'error' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateCourse, handleUpdateCourse, loading };
};