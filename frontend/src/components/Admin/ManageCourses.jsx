import React, { useState, useEffect } from 'react';
import { createCourse, deleteCourse, getAllCourses } from '../../services/api';
import { useAuth } from '../../context/authContext';

const ManageCourses = () => {
    const { user: currentUser } = useAuth();

    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '' });
    const [courseVideo, setCourseVideo] = useState(null);
    const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const fetchedCourses = await getAllCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            setError('Failed to fetch courses. Please try again.');
        }
    };

    const handleInputChange = (field) => (e) => {
        setNewCourse({ ...newCourse, [field]: e.target.value });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();

        if (!newCourse.title || !newCourse.description || !newCourse.instructor_id) {
            setError('Title, description, and instructor are required for creating a course.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newCourse.title);
            formData.append('description', newCourse.description);
            formData.append('instructor_id', newCourse.instructor_id);
            if (courseVideo) {
                formData.append('video', courseVideo); // Add the selected video file
            }

            const response = await createCourse(formData); // Send the formData with the video

            await fetchCourses();

            setNewCourse({ title: '', description: '', instructor_id: '' });
            setCourseVideo(null);
            setSuccess('Course created successfully.');
            setError('');
        } catch (error) {
            setError('Failed to create course. Please try again.');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (confirmDeleteCourseId !== courseId) {
            setConfirmDeleteCourseId(courseId);
            return;
        }

        try {
            await deleteCourse(courseId);
            await fetchCourses();
            setConfirmDeleteCourseId(null);
            setSuccess('Course deleted successfully.');
        } catch (error) {
            setError('Failed to delete course. Please try again.');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [success, error]);

    return (
        <div>
            <h3>Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newCourse.title}
                    onChange={handleInputChange('title')}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={handleInputChange('description')}
                />
                <select
                    value={newCourse.instructor_id}
                    onChange={handleInputChange('instructor_id')}
                >
                    <option value="">Select Instructor</option>
                    <option value={currentUser.id}>{currentUser.name} (You)</option>
                </select>

                {/* Video upload section */}
                <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }} // Hide the default file input
                    id="video-upload" // For accessibility
                    onChange={(e) => {
                        setCourseVideo(e.target.files[0]); // Save the selected file
                    }}
                />
                <label htmlFor="video-upload" style={{ cursor: 'pointer', color: 'blue' }}>
                    {courseVideo ? courseVideo.name : 'Upload Video'}
                </label>

                <button type="submit">Create Course</button>
            </form>

            <h3>All Courses</h3>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Instructor</th>
                    <th>Video URL</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {courses.map(course => (
                    <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>{course.description}</td>
                        <td>{course.instructor_name}</td>
                        <td>
                            {course.video_url && (
                                <a href={course.video_url} target="_blank" rel="noopener noreferrer">
                                    View Video
                                </a>
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleDeleteCourse(course.id)}>
                                {confirmDeleteCourseId === course.id ? 'Confirm Delete' : 'Delete'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default ManageCourses;
