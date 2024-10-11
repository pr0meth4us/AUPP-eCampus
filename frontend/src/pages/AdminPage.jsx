import React, { useEffect, useState } from 'react';
import { getAllUsers, registerInstructor, deleteUser, updateUser, createCourse, getAllCourses, deleteCourse } from '../services/api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // User management states
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '' });
    const [updateUserData, setUpdateUserData] = useState({ id: '', name: '', email: '', password: '' });
    const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

    // Course management states
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructorId: '' });
    const [courseVideo, setCourseVideo] = useState(null);
    const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userData = await getAllUsers();
            setUsers(userData);
            const courseData = await getAllCourses();
            setCourses(courseData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInstructorRegister = async (e) => {
        e.preventDefault();
        if (!newInstructor.name || !newInstructor.email || !newInstructor.password) {
            setError('All fields are required for instructor registration.');
            return;
        }

        try {
            await registerInstructor(newInstructor);
            await fetchData();
            setNewInstructor({ name: '', email: '', password: '' });
            setSuccess('Instructor registered successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to register instructor:', error);
            setError('Failed to register instructor. Please try again.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (confirmDeleteUserId !== userId) {
            setConfirmDeleteUserId(userId);
            return;
        }

        try {
            await deleteUser(userId);
            await fetchData();
            setConfirmDeleteUserId(null);
            setSuccess('User deleted successfully.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            setError('Failed to delete user. Please try again.');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!updateUserData.name || !updateUserData.email) {
            setError('Name and email are required for updating a user.');
            return;
        }

        try {
            await updateUser(updateUserData.id, updateUserData);
            await fetchData();
            setUpdateUserData({ id: '', name: '', email: '', password: '' });
            setSuccess('User updated successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to update user:', error);
            setError('Failed to update user. Please try again.');
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.title || !newCourse.description || !newCourse.instructorId) {
            setError('Title, description, and instructor are required for creating a course.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newCourse.title);
            formData.append('description', newCourse.description);
            formData.append('instructorId', newCourse.instructorId);
            if (courseVideo) {
                formData.append('video', courseVideo);
            }

            await createCourse(formData);
            await fetchData();
            setNewCourse({ title: '', description: '', instructorId: '' });
            setCourseVideo(null);
            setSuccess('Course created successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to create course:', error);
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
            await fetchData();
            setConfirmDeleteCourseId(null);
            setSuccess('Course deleted successfully.');
        } catch (error) {
            console.error('Failed to delete course:', error);
            setError('Failed to delete course. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'users' ? 'bold' : 'normal' }} onClick={() => setActiveTab('users')}>
                        Manage Users
                    </li>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'courses' ? 'bold' : 'normal' }} onClick={() => setActiveTab('courses')}>
                        Manage Courses
                    </li>
                </ul>
            </nav>

            {activeTab === 'users' && (
                <div>
                    <h3>Register New Instructor</h3>
                    <form onSubmit={handleInstructorRegister}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newInstructor.name}
                            onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newInstructor.email}
                            onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newInstructor.password}
                            onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                        />
                        <button type="submit">Register Instructor</button>
                    </form>

                    <h3>All Users</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {confirmDeleteUserId === user.id ? (
                                        <>
                                            <span>Are you sure?</span>
                                            <button onClick={() => handleDeleteUser(user.id)}>Yes</button>
                                            <button onClick={() => setConfirmDeleteUserId(null)}>No</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                            <button onClick={() => setUpdateUserData({ id: user.id, name: user.name, email: user.email, password: '' })}>Edit</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {updateUserData.id && (
                        <div>
                            <h3>Update User</h3>
                            <form onSubmit={handleUpdateUser}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={updateUserData.name}
                                    onChange={(e) => setUpdateUserData({ ...updateUserData, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={updateUserData.email}
                                    onChange={(e) => setUpdateUserData({ ...updateUserData, email: e.target.value })}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password (optional)"
                                    value={updateUserData.password}
                                    onChange={(e) => setUpdateUserData({ ...updateUserData, password: e.target.value })}
                                />
                                <button type="submit">Update User</button>
                                <button onClick={() => setUpdateUserData({ id: '', name: '', email: '', password: '' })}>Cancel</button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'courses' && (
                <div>
                    <h3>Create New Course</h3>
                    <form onSubmit={handleCreateCourse}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        />
                        <select
                            value={newCourse.instructorId}
                            onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
                        >
                            <option value="">Select Instructor</option>
                            {users.filter(user => user.role === 'instructor').map(instructor => (
                                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                            ))}
                        </select>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setCourseVideo(e.target.files[0])}
                        />
                        <button type="submit">Create Course</button>
                    </form>

                    <h3>All Courses</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Instructor</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{users.find(user => user.id === course.instructorId)?.name || 'Unknown'}</td>
                                <td>
                                    {confirmDeleteCourseId === course.id ? (
                                        <>
                                            <span>Are you sure?</span>
                                            <button onClick={() => handleDeleteCourse(course.id)}>Yes</button>
                                            <button onClick={() => setConfirmDeleteCourseId(null)}>No</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default AdminPage;