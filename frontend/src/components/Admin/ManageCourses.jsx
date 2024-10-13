import React, { useState } from 'react';
import { createCourse, deleteCourse, updateCourse } from '../../services/api';
import { useAuth } from '../../context/authContext';
import Notification from "../Notification";

const ManageCourses = ({ users, courses, setCourses, fetchData }) => {
    const { user: currentUser } = useAuth();
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '', video_url: '' });
    const [editCourse, setEditCourse] = useState({ title: '', description: '', instructor_id: '', video_url: '' });
    const [courseVideo, setCourseVideo] = useState(null);
    const [editCourseId, setEditCourseId] = useState(null);
    const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState(null);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

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
            setNotification({ message: 'Course created successfully!', type: 'success' });
            await fetchData();
            resetCreateForm();
        } catch (error) {
            setNotification({ message: 'Failed to create course. Please try again.', type: 'error' });
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
            setNotification({ message: 'Course updated successfully!', type: 'success' });
            await fetchData();
            resetEditForm();
        } catch (error) {
            setNotification({ message: 'Failed to update course. Please try again.', type: 'error' });
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
            await fetchData();
            setConfirmDeleteCourseId(null);
            setNotification({ message: 'Course deleted successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to delete course. Please try again.', type: 'error' });
        }
    };

    return (
        <div>
            <section className="mb-4">
                <h3>Create New Course</h3>
                <form onSubmit={handleCreateCourse} className="mb-3">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={newCourse.title}
                            onChange={handleInputChange('title')}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Description"
                            value={newCourse.description}
                            onChange={handleInputChange('description')}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-select"
                            value={newCourse.instructor_id}
                            onChange={handleInputChange('instructor_id')}
                            required
                        >
                            <option value="">Select Instructor</option>
                            {users.filter(user => user.role === 'instructor').map(instructor => (
                                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="file"
                            accept="video/*"
                            className="form-control"
                            onChange={(e) => setCourseVideo(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Course</button>
                </form>
            </section>

            {editCourseId && (
                <section className="mb-4">
                    <h3>Edit Course</h3>
                    <form onSubmit={handleUpdateCourse} className="mb-3">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={editCourse.title}
                                onChange={handleInputChange('title', true)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                placeholder="Description"
                                value={editCourse.description}
                                onChange={handleInputChange('description', true)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={editCourse.instructor_id}
                                onChange={handleInputChange('instructor_id', true)}
                                required
                            >
                                <option value="">Select Instructor</option>
                                {users.filter(user => user.role === 'instructor').map(instructor => (
                                    <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <input
                                type="file"
                                accept="video/*"
                                className="form-control"
                                onChange={(e) => setCourseVideo(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Update Course</button>
                        <button type="button" className="btn btn-secondary" onClick={resetEditForm}>Cancel</button>
                    </form>
                </section>
            )}

            <section>
                <h3>All Courses</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Instructor</th>
                            <th>Video</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{users.find(user => user.id === course.instructor_id)?.name}</td>
                                <td>
                                    {course.video_url && (
                                        <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                            View Video
                                        </a>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditCourse(course)} className="btn btn-sm btn-outline-secondary me-1">Edit</button>
                                    <button
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className={`btn btn-sm ${confirmDeleteCourseId === course.id ? 'btn-danger' : 'btn-outline-danger'}`}
                                    >
                                        {confirmDeleteCourseId === course.id ? 'Confirm Delete' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <Notification message={notification.message} type={notification.type} />
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default ManageCourses;