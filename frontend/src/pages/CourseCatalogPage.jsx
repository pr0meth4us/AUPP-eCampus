import React, { useEffect, useState } from "react";
import { course } from "../services";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Pagination,
} from "@nextui-org/react";
import CardVideoSkeleton from "../components/skeletons/CardVideoSkeleton";
import { User, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCatalogPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const courseData = await course.getAllCourses();
            setCourses(courseData || []);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseOverview = (courseId) => {
        navigate(`/courseoverview/${courseId}`);
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <div className="min-h-screen pt-[50px] pb-[50px] bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-4">
                <h2 className="text-center text-2xl font-bold mb-8">Course Catalog</h2>
                {loading ? (
                    <CardVideoSkeleton />
                ) : (
                    <>
                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {currentCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="relative w-full h-[300px] shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                        <div
                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                course.price !== "0" 
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-green-500 text-white"
                                            }`}
                                        >
                                            { course.price === "0"  ? "Free" : "Premium"}
                                        </div>
                                        <h3 className="text-white font-bold text-xl mt-3 line-clamp-1">
                                            {course.title}
                                        </h3>
                                    </CardHeader>
                                    <img
                                        alt={`Cover for ${course.title}`}
                                        className="z-0 w-full h-full object-cover rounded-t-lg"
                                        src={course.cover_image_url || "/Course-Placeholder.jpg"}
                                        onError={(e) => {
                                            e.target.src = "/Course-Placeholder.jpg";
                                            e.target.classList.add("opacity-50");
                                        }}
                                    />
                                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 flex flex-col p-4 rounded-b-lg">
                                        <div className="mb-2 flex items-center text-sm text-white">
                                            <User size={16} className="mr-2" />
                                            <span>{course.instructor_name}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleCourseOverview(course.id)}
                                            size="sm"
                                            className="button-no-after bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                                        >
                                            <BookOpen size={16} /> View Course
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-center mt-8">
                            <Pagination
                                total={totalPages}
                                initialPage={currentPage}
                                onChange={(page) => setCurrentPage(page)}
                                className="gap-2"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseCatalogPage;