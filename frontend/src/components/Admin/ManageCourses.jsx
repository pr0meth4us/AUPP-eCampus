import React, { useState } from 'react';
import { Form, Button, Accordion, Table } from 'react-bootstrap';
import { createCourse, deleteCourse, updateCourse } from '../../services/api';
import { useAuth } from '../../context/authContext';
import Notification from "../Notification";

const ManageCourses = ({ users, courses, fetchData }) => {
    const { user: currentUser } = useAuth();
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '' });
    const [editCourse, setEditCourse] = useState(null);
    const [courseVideo, setCourseVideo] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        isEdit ? setEditCourse({ ...editCourse, [name]: value }) : setNewCourse({ ...newCourse, [name]: value });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newCourse).forEach(key => formData.append(key, newCourse[key]));
            formData.append('uploader', currentUser.id);
            if (courseVideo) formData.append('video', courseVideo);

            await createCourse(formData);
            setNotification({ message: 'Course created successfully!', type: 'success' });
            fetchData();
            setNewCourse({ title: '', description: '', instructor_id: '' });
            setCourseVideo(null);
        } catch (error) {
            setNotification({ message: 'Failed to create course.', type: 'error' });
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(editCourse).forEach(key => formData.append(key, editCourse[key]));
            if (courseVideo) formData.append('video', courseVideo);

            await updateCourse(editCourse.id, formData);
            setNotification({ message: 'Course updated successfully!', type: 'success' });
            fetchData();
            setEditCourse(null);
            setCourseVideo(null);
        } catch (error) {
            setNotification({ message: 'Failed to update course.', type: 'error' });
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(courseId);
                fetchData();
                setNotification({ message: 'Course deleted successfully!', type: 'success' });
            } catch (error) {
                setNotification({ message: 'Failed to delete course.', type: 'error' });
            }
        }
    };

    return (
        <div>
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create New Course</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={handleCreateCourse}>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" name="title" placeholder="Title" value={newCourse.title} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" name="description" placeholder="Description" value={newCourse.description} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Select name="instructor_id" value={newCourse.instructor_id} onChange={handleInputChange} required>
                                    <option value="">Select Instructor</option>
                                    {users.filter(user => user.role === 'instructor').map(instructor => (
                                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="file" accept="video/*" onChange={(e) => setCourseVideo(e.target.files[0])} />
                            </Form.Group>
                            <Button type="submit">Create Course</Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Table striped bordered hover responsive>
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
                        <td>{course.instructor}</td>
                        <td>
                            {course.video_url && (
                                <Button variant="link" href={course.video_url} target="_blank" rel="noopener noreferrer">
                                    Watch Video
                                </Button>
                            )}
                        </td>
                        <td>
                            <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => setEditCourse(course)}>Edit</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {editCourse && (
                <Form onSubmit={handleUpdateCourse} className="mt-4">
                    <h3>Edit Course</h3>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" name="title" placeholder="Title" value={editCourse.title} onChange={(e) => handleInputChange(e, true)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control as="textarea" name="description" placeholder="Description" value={editCourse.description} onChange={(e) => handleInputChange(e, true)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select name="instructor_id" value={editCourse.instructor_id} onChange={(e) => handleInputChange(e, true)} required>
                            <option value="">Select Instructor</option>
                            {users.filter(user => user.role === 'instructor').map(instructor => (
                                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="file" accept="video/*" onChange={(e) => setCourseVideo(e.target.files[0])} />
                    </Form.Group>
                    <Button type="submit" className="me-2">Update Course</Button>
                    <Button variant="secondary" onClick={() => setEditCourse(null)}>Cancel</Button>
                </Form>
            )}

            <Notification message={notification.message} type={notification.type} />
        </div>
    );
};

export default ManageCourses;