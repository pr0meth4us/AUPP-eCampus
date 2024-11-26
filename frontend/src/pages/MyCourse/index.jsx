import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { course, user } from "../../services";
import CourseCard from "./components/CourseCard";
import ErrorMessage from "components/common/Error";
import Loading from "components/common/Loading";

const MyCourses = ({ role }) => {
    const { user: currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (role === "student" && currentUser?.courses) {
                    const fetchedCourses = await Promise.all(
                        currentUser.courses.map(async (courseId) => {
                            const courseData = await course.getCourseById(courseId);
                            const instructorName = await user.getName(courseData.instructor_id);
                            return { ...courseData, instructorName };
                        })
                    );
                    setCourses(fetchedCourses);
                } else if (role === "instructor" && currentUser?.role === "instructor") {
                    const fetchedCourses = await Promise.all(
                        currentUser.courses.map(async (courseId) => {
                            const courseData = await course.getCourseById(courseId);
                            const instructorName = await user.getName(courseData.instructor_id);
                            return { ...courseData, instructorName };
                        })
                    );
                    setCourses(fetchedCourses);
                } else {
                    setCourses([]);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [currentUser, role]);

    if (loading) {
        return <Loading message="Loading your courses..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <div className="text-blue-600 text-lg font-semibold mb-2">
                        {role === "student" ? "No Courses Found" : "No Courses Created"}
                    </div>
                    <p className="text-blue-600/80">
                        {role === "student"
                            ? "You haven't enrolled in any courses yet. Explore our catalog to start your learning journey!"
                            : "You haven't created any courses yet. Use the 'Create Course' option to start sharing your knowledge!"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                <div className="flex items-baseline justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {role === "student" ? "My Learning" : "Courses I Teach"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {role === "student"
                                ? "Continue where you left off"
                                : "Manage and update your courses"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        <span className="text-sm font-medium">{courses.length} Courses</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((courseData) => (
                        <CourseCard
                            key={courseData._id}
                            data={courseData}
                            userRole={currentUser.role}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
