import React, { useEffect, useState } from 'react';
import { Form, Accordion, Table, Modal } from 'react-bootstrap';
import {Button} from "@nextui-org/button";
import { createCourse, deleteCourse, updateCourse } from '../../services/api';
import Notification from "../Notification";
import MultiSelectWithSearchAndCreate from './MultiSelectWithSearchAndCreate';
import Select from 'react-select';
import ManageVideos from "./ManageVideos";

const ManageCourses = ({ users, courses, tags, majors, fetchData }) => {
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor_id: '', tag_names: [], major_ids: [] });
    const [editCourse, setEditCourse] = useState(null);
    const [courseVideo, setCourseVideo] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('title', newCourse.title);
            formData.append('description', newCourse.description);
            formData.append('instructor_id', newCourse.instructor_id);

            formData.append('tag_names', JSON.stringify(newCourse.tag_names));

            formData.append('major_ids', JSON.stringify(newCourse.major_ids));

            if (courseVideo) formData.append('video', courseVideo);

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            await createCourse(formData);
            setNotification({ message: 'Course created successfully!', type: 'success' });
            fetchData();
            setNewCourse({ title: '', description: '', instructor_id: '', tag_names: [], major_ids: [] });
            setCourseVideo(null);
        } catch (error) {
            setNotification({ message: 'Failed to create course.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(editCourse).forEach(key => {
                if (Array.isArray(editCourse[key])) {
                    editCourse[key].forEach(item => formData.append(`${key}[]`, item));
                } else {
                    formData.append(key, editCourse[key]);
                }
            });
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
                            <Form.Group className="mb-3">
                                <MultiSelectWithSearchAndCreate
                                    options={tags}
                                    selectedOptions={newCourse.tag_names}
                                    onChange={(selected) => setNewCourse({ ...newCourse, tag_names: selected })}
                                    allowAdd={true}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Select
                                    isMulti
                                    options={majors.map(major => ({ value: major.id, label: major.name }))}
                                    value={newCourse.major_ids.map(id => ({ value: id, label: majors.find(major => major.id === id)?.name }))}
                                    onChange={(selected) => setNewCourse({ ...newCourse, major_ids: selected.map(option => option.value) })}
                                    placeholder="Select Majors"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setCourseVideo(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button type="submit" isLoading={loading}>Create Course</Button>
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
                                return (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{courseUploader}</td>
                                        <td>{courseInstructor}</td>
                                        <td>{courseTags}</td>
                                        <td>{courseMajors}</td>
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
                                );
                            })}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <ManageVideos />

            {editCourse && (
                <Modal show={showEditModal} onHide={() => setEditCourse(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {editCourse.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateCourse}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
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
                                    value={editCourse.description}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
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
                                    <option value="">Select Instructor</option>
                                    {users.filter(user => user.role === 'instructor').map(instructor => (
                                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tags</Form.Label>
                                <MultiSelectWithSearchAndCreate
                                    options={tags}
                                    selectedOptions={editCourse.tag_names}
                                    onChange={(selected) => setEditCourse({ ...editCourse, tag_names: selected })}
                                    allowAdd={true}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Majors</Form.Label>
                                <Select
                                    isMulti
                                    options={majors.map(major => ({ value: major.id, label: major.name }))}
                                    value={editCourse.major_ids.map(id => ({ value: id, label: majors.find(major => major.id === id)?.name }))}
                                    onChange={(selected) => setEditCourse({ ...editCourse, major_ids: selected.map(option => option.value) })}
                                    placeholder="Select Majors"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Update Video (optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setCourseVideo(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button type="submit" isLoading={loading}>Update Course</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
            {notification.message && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default ManageCourses;