import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from "@nextui-org/button";
import MultiSelectWithSearchAndCreate from './MultiSelectWithSearchAndCreate';
import Select from 'react-select';

const CourseForm = ({ onSubmit, users = [], tags = [], majors = [], loading, buttonText, initialData = {} }) => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        instructor_id: '',
        tag_names: [],
        major_ids: [],
        amount: '0' // Keep this as a string initially to avoid confusion
    });
    const [selectedPrice, setSelectedPrice] = useState('');
    const [courseVideo, setCourseVideo] = useState(null);

    const getUniqueTags = (data, allTags) => {
        let uniqueTags = new Set();

        if (data && data.tag_names && Array.isArray(data.tag_names)) {
            data.tag_names.forEach(name => uniqueTags.add(name));
        }

        if (data && data.tag_ids && Array.isArray(data.tag_ids)) {
            data.tag_ids.forEach(tagId => {
                const tag = allTags.find(t => t && t.id === tagId);
                if (tag) uniqueTags.add(tag.name);
            });
        }

        return Array.from(uniqueTags);
    };

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setCourse(prevCourse => ({
                ...prevCourse,
                ...initialData,
                tag_names: getUniqueTags(initialData, tags),
                major_ids: initialData.major_ids || [],
            }));
        }
    }, [initialData, tags]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // If the field is the amount, set it as a number
        if (name === 'amount') {
            setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
        } else {
            setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
        }
    };

    const handlePriceChange = (event) => {
        const value = event.target.value;
        setSelectedPrice(value);
        // If price is charged, clear amount
        if (value !== "charge") {
            setCourse(prevCourse => ({ ...prevCourse, amount: '0' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(course).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
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
                    value={course.title || ''}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={course.description || ''}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Instructor</Form.Label>
                <Form.Select
                    name="instructor_id"
                    value={course.instructor_id || ''}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Instructor</option>
                    {users.filter(user => user && user.role === 'instructor').map(instructor => (
                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Select Pricing Model</Form.Label>
                <Form.Select
                    name="price"
                    value={selectedPrice}
                    onChange={handlePriceChange}
                    required
                >
                    <option value="">Choose a Pricing Model</option>
                    <option value="free">Free Access</option>
                    <option value="charge">Paid Access</option>
                </Form.Select>
            </Form.Group>
            {selectedPrice === "charge" && (
                <Form.Group className="mb-3">
                    <Form.Label>Enter Price (USD)</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        value={course.amount}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter amount"
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <MultiSelectWithSearchAndCreate
                    initialOptions={tags}
                    currentSelections={course.tag_names || []}
                    onChange={(selected) => setCourse(prevCourse => ({ ...prevCourse, tag_names: selected }))}
                    allowAdd={true}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Majors</Form.Label>
                <Select
                    isMulti
                    options={majors.map(major => major ? ({ value: major.id, label: major.name }) : null).filter(Boolean)}
                    value={(course.major_ids || []).map(id => {
                        const major = majors.find(m => m && m.id === id);
                        return major ? { value: id, label: major.name } : null;
                    }).filter(Boolean)}
                    onChange={(selected) => setCourse(prevCourse => ({ ...prevCourse, major_ids: selected.map(option => option.value) }))}
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
