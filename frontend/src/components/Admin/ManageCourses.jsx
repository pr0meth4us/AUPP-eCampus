import React, { useEffect, useState } from 'react';
import { Form, Button, Accordion, Table, Modal } from 'react-bootstrap';
import { createCourse, deleteCourse, updateCourse } from '../../services/api';
import { useAuth } from '../../context/authContext';
import Notification from "../Notification";
import MultiSelectWithSearchAndCreate from './MultiSelectWithSearchAndCreate';
import MultiSelect from 'react-select';

const ManageCourses = ({ users, courses, tags, majors, fetchData }) => {
    const { user: currentUser } = useAuth();
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '', tag_ids: [], major_ids: [] });
    const [editCourse, setEditCourse] = useState(null);
    const [courseVideo, setCourseVideo] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showEditModal, setShowEditModal] = useState(false);

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditCourse({ ...editCourse, [name]: value });
        } else {
            setNewCourse({ ...newCourse, [name]: value });
        }
    };

    useEffect(() => {
        setShowEditModal(!!editCourse);
    }, [editCourse]);

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
            setNewCourse({ title: '', description: '', instructor_id: '', tag_ids: [], major_ids: [] }); // Reset all fields
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
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={newCourse.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    placeholder="Description"
                                    value={newCourse.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Select
                                    name="instructor_id"
                                    value={newCourse.instructor_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Instructor</option>
                                    {users.filter(user => user.role === 'instructor').map(instructor => (
                                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <MultiSelectWithSearchAndCreate
                                options={tags} // For adding new tags
                                selectedOptions={newCourse.tag_ids}
                                onChange={(selectedIds) => setNewCourse({ ...newCourse, tag_ids: selectedIds })}
                                allowAdd={true} // Allow adding new tags
                            />
                            <MultiSelect
                                isMulti
                                options={majors.map(major => ({ value: major.id, label: major.name }))} // Use existing majors
                                value={newCourse.major_ids.map(id => ({ value: id, label: majors.find(major => major.id === id)?.name }))}
                                onChange={(selectedOptions) => setNewCourse({ ...newCourse, major_ids: selectedOptions.map(option => option.value) })}
                                placeholder="Select Majors"
                            />
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setCourseVideo(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button type="submit">Create Course</Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Course List</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Uploader</th>
                                <th>Instructor</th>
                                <th>Tags</th>
                                <th>Majors</th>
                                <th>Video</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map(course => {
                                const courseInstructor = users.find(user => user.id === course.instructor_id)?.name || 'Unknown';
                                const courseUploader = users.find(user => user.id === course.uploader_id)?.name || 'Unknown';
                                const courseTags = course.tag_ids.map(tagId => tags.find(tag => tag.id === tagId)?.name || 'Unknown').join(', ');
                                const courseMajors = course.major_ids.map(majorId => majors.find(major => major.id === majorId)?.name || 'Unknown').join(', ');
                                console.log(users)
                                console.log(course)
                                return (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{courseUploader}</td>
                                        <td>{courseInstructor}</td>
                                        <td>{courseTags}</td>
                                        {/* Display tags as comma-separated */}
                                        <td>{courseMajors}</td>
                                        {/* Display majors as comma-separated */}
                                        <td>
                                            {course.video_url && (
                                                <Button variant="link" href={course.video_url} target="_blank"
                                                        rel="noopener noreferrer">
                                                    Watch Video
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            <Button variant="outline-secondary" size="sm" className="me-1"
                                                    onClick={() => setEditCourse(course)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm"
                                                    onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {editCourse && (
                <Modal show={showEditModal} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {editCourse.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateCourse} className="mt-4">
                            <h3>Edit Course</h3>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={editCourse.title}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    placeholder="Description"
                                    value={editCourse.description}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Uploader</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="uploader"
                                    placeholder="Uploader"
                                    value={editCourse.uploader}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Instructor</Form.Label>
                                <Form.Select
                                    name="instructor_id"
                                    value={editCourse.instructor_id}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                >
                                    <option value={editCourse.instructor}>{editCourse.instructor}</option>
                                    {users.filter(user => user.role === 'instructor').map(instructor => (
                                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <MultiSelectWithSearchAndCreate
                                options={tags}
                                selectedOptions={editCourse.tag_ids}
                                onChange={(selectedIds) => setEditCourse({ ...editCourse, tag_ids: selectedIds })}
                                allowAdd={true} // Allow adding new tags
                            />
                            <MultiSelect
                                isMulti
                                options={majors.map(major => ({ value: major.id, label: major.name }))}
                                value={editCourse.major_ids.map(id => ({ value: id, label: majors.find(major => major.id === id)?.name }))}
                                onChange={(selectedOptions) => setEditCourse({ ...editCourse, major_ids: selectedOptions.map(option => option.value) })}
                                placeholder="Select Majors"
                            />
                            <Form.Group className="mb-3">
                                <Form.Label>Update Video (optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setCourseVideo(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button type="submit">Update Course</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
            {notification.message && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default ManageCourses;
