import React, { useEffect, useState } from "react";
import { course, payment } from "../../services";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Pagination,
    useDisclosure,
} from "@nextui-org/react";
import CardVideoSkeleton from "../../components/Skeletons/CardVideoSkeleton";
import { Lock, User, BookOpen } from "lucide-react"; // Updated icon
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const CourseCatalog = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [enrolling, setEnrolling] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(null);
    const coursesPerPage = 6;

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
        try {
            const response = await payment.createPayment(courseId);
            window.location.href = `${response.approval_url}&courseID=${courseId}`;
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setLoadingPayment(null);
        }
    };

    const handleEnrollment = async () => {
        if (!selectedCourse) return;

        setEnrolling(true);
        try {
            await course.enrollStudent(selectedCourse.id);
            onClose();
            navigate(`/course/${selectedCourse.id}`);
        } catch (error) {
            console.error("Enrollment failed:", error);
        } finally {
            setEnrolling(false);
            setSelectedCourse(null);
        }
    };

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        onOpen();
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <>
            <div className="min-h-screen pt-[50px] pb-[50px] bg-gray-50">
                <div className="max-w-[1200px] mx-auto px-4">
                    <h2 className="text-center text-2xl font-bold mb-8">Course Catalog</h2>
                    {loading ? (
                        <CardVideoSkeleton />
                    ) : (
                        <>
                            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {currentCourses.map((course) => {
                                    const isOwned = user?.courses?.includes(course.id);
                                    const isFree = !course.price || course.price === "0";

                                    return (
                                        <Card
                                            key={course.id}
                                            className="relative w-full h-[300px] shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                                <div
                                                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        !isFree
                                                            ? "bg-yellow-500 text-black"
                                                            : "bg-green-500 text-white"
                                                    }`}
                                                >
                                                    {!isFree ? (
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
                                                alt={`Cover for ${course.title}`}
                                                className="z-0 w-full h-full object-cover rounded-t-lg"
                                                src={course.cover_image_url || "/AUPP-Main-Logo.svg"}
                                                onError={(e) => {
                                                    e.target.src = "/AUPP-Main-Logo.svg";
                                                    e.target.classList.add("opacity-50");
                                                }}
                                            />
                                            <CardFooter className="absolute bg-black/40 bottom-0 z-10 flex flex-col p-4 rounded-b-lg">
                                                <div className="mb-2 flex items-center text-sm text-white">
                                                    <User size={16} className="mr-2" />
                                                    <span>{course.instructor_name}</span>
                                                </div>
                                                {isOwned ? (
                                                    <Button
                                                        onClick={() => navigate(`/course/${course.id}`)}
                                                        size="sm"
                                                        className="button-no-after bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                                                    >
                                                        <BookOpen size={16} /> View Course
                                                    </Button>
                                                ) : !isFree ? (
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
                                                        onClick={() => handleEnrollClick(course)}
                                                        size="sm"
                                                        className="button-no-after bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                                                    >
                                                        <BookOpen size={16} /> Enroll Now
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirm Enrollment</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to enroll in {selectedCourse?.title}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleEnrollment}
                                    isLoading={enrolling}
                                >
                                    {enrolling ? "Enrolling..." : "Enroll"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default CourseCatalog;
