import React from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from "@nextui-org/react";
import CourseHeader from "./components/CourseHeader";
import InstructorCard from "./components/InstructorCard";
import TabsContainer from "./sections";
import CourseDetailsCard from "./components/CourseDetailsCard";
import { useCourseDetails } from "../../hooks/useCourseFetch";
import { useAuth } from "../../context/authContext";
import { course, payment } from "../../services";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, BookOpen } from "lucide-react";

const CoursePage = () => {
    const { course: courseDetails, loading } = useCourseDetails();
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [enrolling, setEnrolling] = React.useState(false);
    const [loadingPayment, setLoadingPayment] = React.useState(false);

    if (loading) {
        return <Spinner />;
    }

    const isOwned = user?.courses?.includes(courseDetails._id);
    const isFree = !courseDetails.price || courseDetails.price === "0";

    const openLoginModal = () => {
        const loginButton = document.querySelector('[data-bs-target="#login"]');
        if (loginButton) {
            loginButton.click();
        }
    };

    const handleCreatePayment = async () => {
        if (!user) {
            openLoginModal();
            return;
        }

        setLoadingPayment(true);
        try {
            const response = await payment.createPayment(courseDetails._id);
            await refreshUser();
            window.location.href = `${response.approval_url}&courseID=${courseDetails._id}`;
        } catch (error) {
            console.error("Payment creation failed", error);
        } finally {
            setLoadingPayment(false);
        }
    };

    const handleEnrollment = async () => {
        if (!user) {
            openLoginModal();
            return;
        }

        setEnrolling(true);
        try {
            await course.enrollStudent(courseDetails._id);
            await refreshUser();
            onClose();
            navigate(`/course/${courseDetails._id}`);
        } catch (error) {
            console.error("Enrollment failed", error);
        } finally {
            setEnrolling(false);
        }
    };

    const handleStartStudying = () => {
        navigate(`/course/${courseDetails._id}/`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-6 pb-12">
            <div className="max-w-[1400px] mx-auto px-4">
                <CourseHeader course={courseDetails} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InstructorCard instructor={courseDetails.instructor} />
                        <TabsContainer course={courseDetails} />
                    </div>
                    <div className="lg:col-span-1">
                        <CourseDetailsCard course={courseDetails} />
                        {isOwned ? (
                            <button
                                onClick={handleStartStudying}
                                className="mt-6 w-full py-2 px-4 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none flex items-center justify-center gap-2"
                            >
                                <BookOpen size={16} /> Start Studying
                            </button>
                        ) : !isFree ? (
                            <Button
                                onClick={handleCreatePayment}
                                isLoading={loadingPayment}
                                className="mt-6 w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                {!user ? (
                                    <>
                                        <LogIn size={16} /> Login to Buy - ${courseDetails.price}
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} /> Buy - ${courseDetails.price}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onOpen}
                                className="mt-6 w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                {!user ? (
                                    <>
                                        <LogIn size={16} /> Login to Enroll
                                    </>
                                ) : (
                                    <>
                                        <BookOpen size={16} /> Enroll Now
                                    </>
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
                            <ModalHeader className="flex flex-col gap-1">Confirm Enrollment</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to enroll in {courseDetails.title}?</p>
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
        </div>
    );
};

export default CoursePage;