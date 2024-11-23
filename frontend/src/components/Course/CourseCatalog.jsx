import React, {useEffect, useState} from "react";
import {course, payment} from "../../services";
import {Button, Card, CardFooter, CardHeader, Pagination} from "@nextui-org/react";
import CardVideoSkeleton from "../../components/Skeletons/CardVideoSkeleton";
import {Lock, PlayCircle, User} from "lucide-react";

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;
    const [loadingPayment, setLoadingPayment] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const courseData = await course.getAllCourses();
            setCourses(courseData || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePayment = async (courseId) => {
        setLoadingPayment(courseId);
        const response = await payment.createPayment(courseId);
        window.location.href = `${response.approval_url}&courseID=${courseId}`;
        setLoadingPayment(null);
    };


    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <>
            <div className="min-h-screen pt-[150px] pb-[50px] bg-gray-50">
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
                                                    course.price && course.price !== "0"
                                                        ? "bg-yellow-500 text-black"
                                                        : "bg-green-500 text-white"
                                                }`}
                                            >
                                                {course.price && course.price !== "0" ? (
                                                    <div className="flex items-center gap-1">
                                                        <Lock size={12} />
                                                        Premium
                                                    </div>
                                                ) : (
                                                    "Free"
                                                )}
                                            </div>
                                            <h3 className="text-white font-bold text-xl mt-3 line-clamp-1">
                                                {course.title}
                                            </h3>
                                        </CardHeader>
                                        <img
                                            alt={`Thumbnail for ${course.title}`}
                                            className="z-0 w-full h-full object-cover rounded-t-lg"
                                            src={course.thumbnail_url}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300"; // Fallback image
                                                e.target.classList.add("opacity-50");
                                            }}
                                        />
                                        <CardFooter className="absolute bg-black/40 bottom-0 z-10 flex flex-col p-4 rounded-b-lg">
                                            <div className="mb-2 flex items-center text-sm text-white">
                                                <User size={16} className="mr-2" />
                                                <span>{course.instructor_name}</span>
                                            </div>
                                                {course.price && course.price !== "0" ? (
                                                    <Button
                                                    onClick={() => handleCreatePayment(course.id)}
                                                    isLoading={loadingPayment === course.id}
                                                    size="sm"
                                                    className="button-no-after bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                                                    >
                                                        <Lock size={16} /> Buy - ${course.price}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        as="a"
                                                        href={course.video_url}
                                                        target="_blank"
                                                        size="sm"
                                                        className="button-no-after bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                                                    >
                                                        <PlayCircle size={16} /> Enroll
                                                    </Button>
                                                )}
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
        </>
    );
};

export default CourseCatalog;
