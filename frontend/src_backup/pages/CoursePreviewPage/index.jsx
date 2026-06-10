// src/pages/CoursePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { Lock, LogIn, BookOpen } from "lucide-react";

import { useAuth } from "../../context/authContext";
import { payment } from "../../services";
import { course as CourseApi } from "../../services";
import { useCourseDetails } from "../../hooks/useCourseFetch";

import CourseHeader from "./components/CourseHeader";
import InstructorCard from "./components/InstructorCard";
import TabsContainer from "./sections";
import CourseDetailsCard from "./components/CourseDetailsCard";

const CoursePage = ({ mode = "preview" }) => {
    const { course, loading, error } = useCourseDetails(mode);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [enrolling, setEnrolling] = React.useState(false);
    const [loadingPayment, setLoadingPayment] = React.useState(false);

    // 1) show spinner only while loading
    // 2) once loading=false and course is truthy, render the UI
    if (loading) return <Spinner />;
    if (error)   return <div>Error loading course</div>;
    if (!course) return <div>Course not found</div>;

    const isOwned = user?.courses?.includes(course._id);
    const isFree  = !course.price || course.price === "0";

    const openLoginModal = () =>
        document.querySelector('[data-bs-target="#login"]')?.click();

    const handleCreatePayment = async () => {
        if (!user) return openLoginModal();
        setLoadingPayment(true);
        try {
            const response = await payment.createPayment(course._id);
            await refreshUser();
            window.location.href = `${response.approval_url}&courseID=${course._id}`;
        } catch (err) {
            console.error("Payment creation failed", err);
        } finally {
            setLoadingPayment(false);
        }
    };

    const handleEnrollment = async () => {
        if (!user) return openLoginModal();
        setEnrolling(true);
        try {
            await CourseApi.enrollStudent(course._id);
            await refreshUser();
            onClose();
            navigate(`/course/${course._id}`);
        } catch (err) {
            console.error("Enrollment failed", err);
        } finally {
            setEnrolling(false);
        }
    };

    const handleStartStudying = () => {
        navigate(`/course/${course._id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-12">
            <div className="max-w-[1400px] mx-auto px-4">
                <CourseHeader course={course} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InstructorCard
                            instructor_name={course.instructor.name}
                            instructor_pfp={course.instructor.profile_image}
                        />
                        <TabsContainer
                            course={course}
                            assignments={course.assignments}
                            modules={course.modules}
                            people={course.people}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <CourseDetailsCard course={course} />

                        {isOwned ? (
                            <Button
                                onClick={handleStartStudying}
                                className="mt-6 w-full bg-green-500 text-white flex items-center justify-center gap-2"
                            >
                                <BookOpen size={16} /> Start Studying
                            </Button>
                        ) : !isFree ? (
                            <Button
                                onClick={handleCreatePayment}
                                isLoading={loadingPayment}
                                className="mt-6 w-full bg-blue-500 text-white flex items-center gap-2"
                            >
                                {!user ? (
                                    <><LogIn size={16} /> Login to Buy – ${course.price}</>
                                ) : (
                                    <><Lock size={16} /> Buy – ${course.price}</>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onOpen}
                                className="mt-6 w-full bg-blue-500 text-white flex items-center gap-2"
                            >
                                {!user ? (
                                    <><LogIn size={16} /> Login to Enroll</>
                                ) : (
                                    <><BookOpen size={16} /> Enroll Now</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Confirm Enrollment</ModalHeader>
                            <ModalBody>
                                Are you sure you want to enroll in "{course.title}"?
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" color="danger" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button onPress={handleEnrollment} isLoading={enrolling}>
                                    {enrolling ? "Enrolling..." : "Enroll"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CoursePage;
