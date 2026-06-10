import { useState } from 'react';
import { course } from 'services';

export const useCourseActions = (fetchData, setNotification) => {
    const [loading, setLoading] = useState(false);

    const handleCreateCourse = async (formData) => {
        setLoading(true);
        try {
            await course.createCourse(formData);
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
            await course.updateCourse(courseId, formData);
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