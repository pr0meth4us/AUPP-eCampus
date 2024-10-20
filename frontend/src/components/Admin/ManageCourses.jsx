import React, {  useState } from 'react';
import {  Accordion, Table, Modal } from 'react-bootstrap';
import {  deleteCourse } from '../../services/api';
import Notification from "../Notification";
import CourseForm from './CourseForm';
import { useCourseActions } from './useCourseActions';
import ManageVideos from "./ManageVideos";

const ManageCourses = ({ users, courses, tags, majors, fetchData }) => {
    const [editCourse, setEditCourse] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showEditModal, setShowEditModal] = useState(false);

    const { handleCreateCourse, handleUpdateCourse, loading } = useCourseActions(fetchData, setNotification);

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

    const handleEditSubmit = async (formData) => {
        const success = await handleUpdateCourse(editCourse.id, formData);
        if (success) {
            setShowEditModal(false);
            setEditCourse(null);
        }
    };


    return (
        <div>
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create New Course</Accordion.Header>
                    <Accordion.Body>
                        <CourseForm
                            onSubmit={handleCreateCourse}
                            users={users}
                            tags={tags}
                            majors={majors}
                            loading={loading}
                            buttonText="Create Course"
                        />
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
                                                <Link
                                                    variant="link" to={course.video_url} target="_blank" rel="noopener noreferrer">
                                                    Watch Video
                                                </Link>
                                            )}
                                        </td>
                                        <td>
                                            <ReactButton variant="outline-secondary" size="sm" className="me-1" onClick={() => {
                                                setEditCourse(course);
                                                setShowEditModal(true);
                                            }}>Edit</ReactButton>
                                            <ReactButton variant="outline-danger" size="sm" onClick={() => handleDeleteCourse(course.id)}>Delete</ReactButton>
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

            <Modal show={showEditModal} onHide={() => {
                setEditCourse(null);
                setShowEditModal(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {editCourse?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseForm
                        onSubmit={handleEditSubmit}
                        users={users}
                        tags={tags}
                        majors={majors}
                        loading={loading}
                        buttonText="Update Course"
                        initialData={editCourse}
                    />
                </Modal.Body>
            </Modal>
            {notification.message && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default ManageCourses;