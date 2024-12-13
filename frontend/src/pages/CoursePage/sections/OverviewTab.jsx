import React from "react";
import { Card, CardBody, Chip, Avatar } from "@nextui-org/react";
import { BookText, Tags, Target, Calendar, Clock, User } from "lucide-react";

const OverviewTab = ({ course }) => {
    // Derive course details with fallback values
    const courseDetails = [
        {
            icon: <BookText size={20} className="text-primary" />,
            label: "Description",
            value: course?.description || "No description available"
        },
        {
            icon: <Target size={20} className="text-green-500" />,
            label: "Course Length",
            value: course?.course_length || "Not specified"
        },
        {
            icon: <Calendar size={20} className="text-blue-500" />,
            label: "Created",
            value: course?.created_at
                ? new Date(course.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : "Date not available"
        }
    ];

    return (
        <div className="space-y-6">
            <Card className="shadow-md">
                <CardBody>
                    <div className="flex items-start gap-4">
                        <BookText size={40} className="text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-bold mb-2">{course?.title || "Untitled Course"}</h3>
                            <p className="text-gray-600">{course?.description || "No description available"}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">


                {/* Tags and Majors Section */}
                <Card className="shadow-md">
                    <CardBody>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tags size={20} className="text-green-500" /> Course Categories
                            </h3>

                            <div className="space-y-4">
                                {/* Majors */}
                                <div>
                                    <p className="font-medium mb-2 text-gray-700">Majors</p>
                                    <div className="flex flex-wrap gap-2">
                                        {course?.major_names?.length ? (
                                            course.major_names.map((major, index) => (
                                                <Chip
                                                    key={index}
                                                    variant="flat"
                                                    color="primary"
                                                    size="sm"
                                                >
                                                    {major}
                                                </Chip>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No majors listed</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <p className="font-medium mb-2 text-gray-700">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {course?.tag_names?.length ? (
                                            course.tag_names.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    variant="flat"
                                                    color="secondary"
                                                    size="sm"
                                                >
                                                    {tag}
                                                </Chip>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No tags listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default OverviewTab;