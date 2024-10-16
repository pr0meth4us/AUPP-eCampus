import React, { useEffect, useState } from "react";
import { getAllCourses } from "../services/api";
import Header from "../components/Home/Header";
import Footer from "../components/Footer";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const courseData = await getAllCourses();
            setCourses(courseData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="g-4">
                    {courses.map(course => (
                        <Col key={course.id} xs={12} md={6} lg={4}>
                            <Card>
                                <Card.Img variant="top" src={course.thumbnail_url} alt={`Thumbnail for ${course.title}`} />
                                <Card.Body>
                                    <i className="bi bi-person-workspace text-muted"></i><small className="p-2 text-muted">{course.instructor_name}</small>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text>{course.description}</Card.Text>
                                    <Button variant="primary" href={course.video_url} target="_blank">Watch</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default CourseCatalog;