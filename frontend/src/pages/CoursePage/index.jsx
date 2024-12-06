import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {course as CourseApi} from "../../services";
import {Spinner} from "@nextui-org/react";
import CourseHeader from "./components/CourseHeader";
import InstructorCard from "./components/InstructorCard";
import TabsContainer from "./sections";
import CourseDetailsCard from "./components/CourseDetailsCard";

const Index = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseData = await CourseApi.getDetailsById(id);
                if (!courseData) throw new Error("Course data not found");
                setCourse(courseData);
            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
