import React, { useEffect, useState } from "react";
import { getAllCourses } from "../services/api";
import Header from "../components/Home/Header";
import Footer from "../components/Footer";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button
} from "@material-tailwind/react";

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
            <div className="flex flex-wrap justify-center gap-6 p-4">
                {courses.map(course => (
                    <Card key={course.id} className="mt-6 w-96">
                        <CardHeader color="blue-gray" className="relative h-56">
                            <img
                                src={course.thumbnail_url}
                                alt={`Thumbnail for ${course.title}`}
                                className="w-full h-full object-cover"
                            />
                        </CardHeader>
                        <CardBody>
                            <Typography variant="h5" color="blue-gray" className="mb-2">
                                {course.title}
                            </Typography>
                            <Typography>{course.description}</Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button>Learn More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default CourseCatalog;