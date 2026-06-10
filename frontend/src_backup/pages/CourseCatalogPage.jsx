// src/pages/CourseCatalogPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { course as CourseApi } from "../services";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Pagination,
} from "@heroui/react";
import CardVideoSkeleton from "../components/skeletons/CardVideoSkeleton";
import { User, BookOpen } from "lucide-react";

const CourseCatalogPage = () => {
    const { user } = useAuth();
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
            const data = await CourseApi.getAllCourses();
            setCourses(data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseOverview = (courseId) => {
        const isEnrolled = user?.courses?.includes(courseId);
        navigate(
            isEnrolled
                ? `/course/${courseId}`
                : `/course/preview/${courseId}`
        );
    };

    const indexOfLast = currentPage * coursesPerPage;
    const indexOfFirst = indexOfLast - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <div className="min-h-screen pt-[50px] pb-[50px] bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-4">
                <h2 className="text-center text-2xl font-bold mb-8">Course Catalog</h2>
                {loading ? (
                    <CardVideoSkeleton />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentCourses.map((c) => (
                                <Card
                                    key={c._id}
                                    className="relative h-[300px] shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                        <div
                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                c.price === "0"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-yellow-500 text-black"
                                            }`}
                                        >
                                            {c.price === "0" ? "Free" : "Premium"}
                                        </div>
                                        <h3 className="text-white font-bold text-xl mt-3 line-clamp-1">
                                            {c.title}
                                        </h3>
                                    </CardHeader>
                                    <img
                                        src={c.cover_image_url || "/Course-Placeholder.jpg"}
                                        alt={`Cover for ${c.title}`}
                                        className="z-0 w-full h-full object-cover rounded-t-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = "/Course-Placeholder.jpg";
                                            e.currentTarget.classList.add("opacity-50");
                                        }}
                                    />
                                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 flex flex-col p-4 rounded-b-lg">
                                        <div className="mb-2 flex items-center text-sm text-white">
                                            <User size={16} className="mr-2" />
                                            <span>{c.instructor_name}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleCourseOverview(c._id)}
                                            size="sm"
                                            className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
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
                                onChange={setCurrentPage}
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
