import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Button } from "@nextui-org/button";
import { useNavigate } from 'react-router-dom';
import { course as courseService } from '../services';

const CourseCreate = () => {
    const navigate = useNavigate();

    // --- Form state ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagIds, setTagIds] = useState([]);       // array of tag _id strings
    const [majorIds, setMajorIds] = useState([]);   // array of major _id strings
    const [price, setPrice] = useState('0');
    const [selectedPrice, setSelectedPrice] = useState(''); // '' | 'free' | 'charge'
    const [coverImage, setCoverImage] = useState(null);

    // --- Options loaded from server ---
    const [tags, setTags] = useState([]);     // will hold [{ _id, name }, …]
    const [majors, setMajors] = useState([]); // will hold [{ _id, name }, …]

    // --- UI state ---
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch tags + majors once on mount
    useEffect(() => {
        (async () => {
            try {
                const [fetchedTags, fetchedMajors] = await Promise.all([
                    courseService.fetchTags(),
                    courseService.fetchMajors()
                ]);

                setTags(Array.isArray(fetchedTags) ? fetchedTags : []);
                setMajors(Array.isArray(fetchedMajors) ? fetchedMajors : []);
            } catch (err) {
                console.error('Failed to load tags or majors:', err);
                setErrorMessage('Unable to load tags/majors. Please try again later.');
            }
        })();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('price', selectedPrice === 'charge' ? price : '0');

            // Append each tag ID (so Flask sees tag_ids[]=…)
            tagIds.forEach(id => formData.append('tag_ids', id));

            // Append each major ID (so Flask sees major_ids[]=…)
            majorIds.forEach(id => formData.append('major_ids', id));

            if (coverImage instanceof File) {
                formData.append('cover_image', coverImage);
            }

            const data = await courseService.createCourse(formData);
            // On success, navigate to the newly created course's detail page
            navigate(`/courses/${data.course_id}`);
        } catch (err) {
            console.error('Error creating course:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMessage(err.response.data.error);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            {errorMessage && (
                <div
                    style={{
                        backgroundColor: '#f8d7da',
                        color: '#842029',
                        padding: '10px',
                        borderRadius: '4px',
                        margin: '0 20px 20px',
                        textAlign: 'center',
                    }}
                >
                    {errorMessage}
                </div>
            )}

            <h2 className="text-center mb-4">Create a New Course</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Form onSubmit={handleSubmit}>
                        {/* Title */}
                        <Form.Group className="mb-4">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter course title"
                                required
                            />
                        </Form.Group>

                        {/* Description */}
                        <Form.Group className="mb-4">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Enter course description"
                                rows={5}
                                required
                            />
                        </Form.Group>

                        {/* Pricing Model */}
                        <Form.Group className="mb-4">
                            <Form.Label>Select Pricing Model</Form.Label>
                            <Form.Select
                                name="pricing_select"
                                value={selectedPrice}
                                onChange={e => {
                                    const val = e.target.value;
                                    setSelectedPrice(val);
                                    if (val !== 'charge') {
                                        setPrice('0');
                                    }
                                }}
                                required
                            >
                                <option value="">Choose a Pricing Model</option>
                                <option value="free">Free Access</option>
                                <option value="charge">Paid Access</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Price Input (shown only if Paid Access) */}
                        {selectedPrice === 'charge' && (
                            <Form.Group className="mb-4">
                                <Form.Label>Enter Price (USD)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="Enter price"
                                    required
                                />
                            </Form.Group>
                        )}

                        {/* Tags Multi-Select */}
                        <Form.Group className="mb-4">
                            <Form.Label>Tags</Form.Label>
                            <Select
                                isMulti
                                name="tag_ids"
                                options={tags.map(tag => ({
                                    value: tag._id,
                                    label: tag.name,
                                }))}
                                value={tagIds
                                    .map(id => {
                                        const t = tags.find(t => t._id === id);
                                        return t ? { value: t._id, label: t.name } : null;
                                    })
                                    .filter(Boolean)}
                                onChange={selectedOptions => {
                                    const ids = selectedOptions
                                        ? selectedOptions.map(o => o.value)
                                        : [];
                                    setTagIds(ids);
                                }}
                                placeholder="Select tags"
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>

                        {/* Majors Multi-Select */}
                        <Form.Group className="mb-4">
                            <Form.Label>Majors</Form.Label>
                            <Select
                                isMulti
                                name="major_ids"
                                options={majors.map(major => ({
                                    value: major._id,
                                    label: major.name,
                                }))}
                                value={majorIds
                                    .map(id => {
                                        const m = majors.find(m => m._id === id);
                                        return m ? { value: m._id, label: m.name } : null;
                                    })
                                    .filter(Boolean)}
                                onChange={selectedOptions => {
                                    const ids = selectedOptions
                                        ? selectedOptions.map(o => o.value)
                                        : [];
                                    setMajorIds(ids);
                                }}
                                placeholder="Select majors"
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>

                        {/* Cover Image Upload */}
                        <Form.Group className="mb-4">
                            <Form.Label>Upload Cover Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={e => setCoverImage(e.target.files[0])}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button type="submit" isLoading={loading} className="px-5">
                                Create
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CourseCreate;
