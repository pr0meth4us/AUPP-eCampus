import React, { useState, useEffect } from 'react';
import { createCourse, deleteCourse, getAllCourses, updateCourse } from '../../services/api';
import { useAuth } from '../../context/authContext';

const ManageCourses = () => {
    const { user: currentUser } = useAuth();

    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '', video_url: '' });
    const [editCourse, setEditCourse] = useState({ title: '', description: '', instructor_id: '', video_url: '' });
    const [courseVideo, setCourseVideo] = useState(null);
    const [editCourseId, setEditCourseId] = useState(null);
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

    const handleInputChange = (field, isEdit = false) => (e) => {
        if (isEdit) {
            setEditCourse({ ...editCourse, [field]: e.target.value });
        } else {
            setNewCourse({ ...newCourse, [field]: e.target.value });
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();

        if (!newCourse.title || !newCourse.description || !newCourse.instructor_id) {
            setError('Title, description, and instructor are required.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newCourse.title);
            formData.append('description', newCourse.description);
            formData.append('instructor_id', newCourse.instructor_id);
            formData.append('uploader', currentUser.id);

            if (courseVideo) {
                formData.append('video', courseVideo);
            }

            await createCourse(formData);
            setSuccess('Course created successfully.');
            await fetchCourses();
            resetCreateForm();
        } catch (error) {
            setError('Failed to create course. Please try again.');
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();

        if (!editCourse.title || !editCourse.description || !editCourse.instructor_id) {
            setError('Title, description, and instructor are required.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', editCourse.title);
            formData.append('description', editCourse.description);
            formData.append('instructor_id', editCourse.instructor_id);

            if (courseVideo) {
                formData.append('video', courseVideo);
            }

            await updateCourse(editCourseId, formData);
            setSuccess('Course updated successfully.');
            await fetchCourses();
            resetEditForm();
        } catch (error) {
            setError('Failed to update course. Please try again.');
        }
    };

    const resetCreateForm = () => {
        setNewCourse({ title: '', description: '', instructor_id: '', video_url: '' });
        setCourseVideo(null);
    };

    const resetEditForm = () => {
        setEditCourse({ title: '', description: '', instructor_id: '', video_url: '' });
        setCourseVideo(null);
        setEditCourseId(null);
    };

    const handleEditCourse = (course) => {
        setEditCourse({
            title: course.title,
            description: course.description,
            instructor_id: course.instructor_id,
            video_url: course.video_url
        });
        setEditCourseId(course.id);
        setCourseVideo(null);
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
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={handleInputChange('description')}
                    required
                />
                <select
                    value={newCourse.instructor_id}
                    onChange={handleInputChange('instructor_id')}
                    required
                >
                    <option value="">Select Instructor</option>
                    <option value={currentUser.id}>{currentUser.name} (You)</option>
                </select>

                <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    id="video-upload-create"
                    onChange={(e) => {
                        setCourseVideo(e.target.files[0]);
                    }}
                />
                <label htmlFor="video-upload-create" style={{ cursor: 'pointer', color: 'blue' }}>
                    {courseVideo ? courseVideo.name : 'Upload Video'}
                </label>

                <button type="submit">Create Course</button>
            </form>

            {editCourseId && (
                <>
                    <h3>Edit Course</h3>
                    <form onSubmit={handleUpdateCourse}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editCourse.title}
                            onChange={handleInputChange('title', true)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editCourse.description}
                            onChange={handleInputChange('description', true)}
                            required
                        />
                        <select
                            value={editCourse.instructor_id}
                            onChange={handleInputChange('instructor_id', true)}
                            required
                        >
                            <option value="">Select Instructor</option>
                            <option value={currentUser.id}>{currentUser.name} (You)</option>
                        </select>

                        {editCourse.video_url && (
                            <div>
                                <a href={editCourse.video_url} target="_blank" rel="noopener noreferrer">View Current Video</a>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            id="video-upload-edit"
                            onChange={(e) => {
                                setCourseVideo(e.target.files[0]);
                            }}
                        />
                        <label htmlFor="video-upload-edit" style={{ cursor: 'pointer', color: 'blue' }}>
                            {courseVideo ? courseVideo.name : 'Replace Video'}
                        </label>

                        <button type="submit">Update Course</button>
                    </form>
                </>
            )}

            <h3>All Courses</h3>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Instructor</th>
                    <th>Uploader</th>
                    <th>Video URL</th>
                    <th>Thumbnail</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {courses.map(course => (
                    <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>{course.description}</td>
                        <td>{course.instructor}</td>
                        <td>{course.uploader}</td>
                        <td>
                            {course.video_url && (
                                <a href={course.video_url} target="_blank" rel="noopener noreferrer">
                                    View Video
                                </a>
                            )}
                        </td>
                        <td>
                            {course.thumbnail_url && (
                                <img src={course.thumbnail_url} alt="Thumbnail" style={{ width: '100px', height: 'auto' }} />
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleEditCourse(course)}>Edit</button>
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