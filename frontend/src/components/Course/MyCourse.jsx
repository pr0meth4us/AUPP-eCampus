import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { course } from "../../services";
import {
    PlayIcon,
    UserIcon,
    ClockIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline';

const CourseCard = ({ data }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative">
            <img
                src={data.thumbnail_url || "https://via.placeholder.com/300"}
                alt={data.title}
                className="h-48 w-full object-cover"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
        In Progress
      </span>
        </div>

        <div className="p-5 space-y-4">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold line-clamp-2">
                    {data.title}
                </h3>

                <div className="flex items-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{data.instructor_id}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-blue-600 font-medium">{data.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.progress || 0}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <button className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                    <PlayIcon className="h-4 w-4 mr-1.5" />
                    Continue
                </button>
                <div className="flex items-center text-gray-500 text-sm">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    4h remaining
                </div>
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-2 bg-gray-200 rounded w-full" />
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const MyCourse = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (user?.courses) {
                    const fetchedCourses = await Promise.all(
                        user.courses.map((cId) => course.getCourseById(cId))
                    );
                    setCourses(fetchedCourses);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LoadingSkeleton />
            </div>
        );
    }

    if (!user || !user.courses || user.courses.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <div className="text-blue-600 text-lg font-semibold mb-2">
                        No Courses Found
                    </div>
                    <p className="text-blue-600/80">
                        You haven't enrolled in any courses yet. Explore our catalog to start your learning journey!
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
                        <h1 className="text-2xl font-bold">My Learning</h1>
                        <p className="text-gray-600 mt-1">
                            Continue where you left off
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        <BookOpenIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
              {courses.length} Courses
            </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((courseData) => (
                        <CourseCard key={courseData._id} data={courseData} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyCourse;