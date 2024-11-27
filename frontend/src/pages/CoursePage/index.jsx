import React from "react";
import CourseHeader from "./components/CourseHeader";
import InstructorCard from "./components/InstructorCard";
import TabsContainer from "./sections";
import CourseDetailsCard from "./components/CourseDetailsCard";
import { useCourseDetails } from "../../hooks/useCourseFetch";
import { Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const { course, loading } = useCourseDetails();
    const navigate = useNavigate();

    if (loading) {
        return <Spinner />;
    }

    const handleStartStudying = () => {
        navigate(`/course/${course._id}/`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-6 pb-12">
            <div className="max-w-[1400px] mx-auto px-4">
                <CourseHeader course={course} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InstructorCard instructor={course.instructor} />
                        <TabsContainer course={course} />
                    </div>
                    <div className="lg:col-span-1">
                        <CourseDetailsCard course={course} />
                        <button
                            onClick={handleStartStudying}
                            className="mt-6 w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            Start Studying
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
