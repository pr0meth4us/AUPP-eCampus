import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from "@nextui-org/button";
import MultiSelectWithSearchAndCreate from './MultiSelectWithSearchAndCreate';
import Select from 'react-select';

const CourseForm = ({ onSubmit, users, tags, majors, loading, buttonText, initialData = {} }) => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        instructor_id: '',
        tag_names: [],
        major_ids: [],
        ...initialData
    });
    const [courseVideo, setCourseVideo] = useState(null);

    useEffect(() => {
        setCourse({ ...course, ...initialData });
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(course).forEach(key => {
            if (Array.isArray(course[key])) {
                formData.append(key, JSON.stringify(course[key]));
            } else {
                formData.append(key, course[key]);
            }
        });
        if (courseVideo) formData.append('video', courseVideo);
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={course.title}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={course.description}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Instructor</Form.Label>
                <Form.Select
                    name="instructor_id"
                    value={course.instructor_id}
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
                <Form.Label>Tags</Form.Label>
                <MultiSelectWithSearchAndCreate
                    initialOptions={tags}
                    currentSelections={course.tag_names}
                    onChange={(selected) => setCourse({ ...course, tag_names: selected })}
                    allowAdd={true}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Majors</Form.Label>
                <Select
                    isMulti
                    options={majors.map(major => ({ value: major.id, label: major.name }))}
                    value={course.major_ids.map(id => ({ value: id, label: majors.find(major => major.id === id)?.name }))}
                    onChange={(selected) => setCourse({ ...course, major_ids: selected.map(option => option.value) })}
                    placeholder="Select Majors"
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => setCourseVideo(e.target.files[0])}
                />
            </Form.Group>
            <Button type="submit" isLoading={loading}>{buttonText}</Button>
        </Form>
    );
};

export default CourseForm;