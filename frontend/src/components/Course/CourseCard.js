import React from "react";
import { Link } from "react-router-dom";
import { UserIcon, ClockIcon, PlayIcon } from "@heroicons/react/24/outline";

const CourseCard = ({ data, userRole }) => {
    // Determine the route based on the user's role
    const courseRoute = userRole === "instructor"
        ? `/instructor/course/${data._id}`
        : `/course/${data._id}`;

    return (
        <Link
            to={courseRoute}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
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
                    <h3 className="text-lg font-semibold line-clamp-2">{data.title}</h3>
                    <div className="flex items-center text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{data.instructorName || "Unknown Instructor"}</span>
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
                    <div className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        <PlayIcon className="h-4 w-4 mr-1.5" />
                        Continue
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1.5" />
                        4h remaining
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
