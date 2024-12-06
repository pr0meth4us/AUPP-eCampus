import React from "react";
import { Card, CardBody, Avatar, Chip } from "@nextui-org/react";
import { GraduationCap, Users } from "lucide-react";

const PeopleTab = ({ course }) => (
    <div className="mt-4 space-y-6">
        {/* Instructor Section */}
        <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap size={24} className="mr-2 text-primary" />
                Instructor
            </h3>
            {course?.instructor ? (
                <Card className="shadow-md">
                    <CardBody className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            {course.instructor.profile_image ? (
                                <Avatar
                                    src={course.instructor.profile_image}
                                    className="w-20 h-20 border-3 border-primary"
                                />
                            ) : (
                                <Avatar
                                    icon={<GraduationCap size={24} />}
                                    classNames={{
                                        base: "w-20 h-20 bg-gradient-to-br from-primary-300 to-primary-600",
                                        icon: "text-white",
                                    }}
                                />
                            )}
                            <div>
                                <p className="text-lg font-semibold">{`Professor ${course.instructor.name}`}</p>
                                <p className="text-sm text-gray-500">{course.instructor.email}</p>
                                <div className="mt-2 flex items-center space-x-2">
                                    {course.instructor.department && (
                                        <Chip
                                            variant="flat"
                                            color="primary"
                                            size="sm"
                                        >
                                            {course.instructor.department}
                                        </Chip>
                                    )}
                                    {course.instructor.title && (
                                        <Chip
                                            variant="flat"
                                            color="secondary"
                                            size="sm"
                                        >
                                            {course.instructor.title}
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <p className="text-gray-500 text-center py-4">
                    No instructor information available.
                </p>
            )}
        </div>

        {/* Students Section */}
        <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users size={24} className="mr-2 text-primary" />
                Students Enrolled
            </h3>
            {course?.enrolled_students?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.enrolled_students.map((student, index) => (
                        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardBody className="flex flex-col items-center">
                                {student.profile_image ? (
                                    <Avatar
                                        src={student.profile_image}
                                        className="w-16 h-16 mb-3 border-3 border-primary"
                                    />
                                ) : (
                                    <Avatar
                                        icon={<Users size={24} />}
                                        classNames={{
                                            base: "w-16 h-16 mb-3 bg-gradient-to-br from-secondary-300 to-secondary-600",
                                            icon: "text-white",
                                        }}
                                    />
                                )}
                                <p className="font-semibold text-center">{student.name}</p>
                                <p className="text-sm text-gray-500 text-center">{student.email}</p>
                                {student.major && (
                                    <Chip
                                        variant="flat"
                                        color="secondary"
                                        size="sm"
                                        className="mt-2"
                                    >
                                        {student.major}
                                    </Chip>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">
                    No students have enrolled in this course yet.
                </p>
            )}
            {course?.enrolled_students?.length > 0 && (
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                        Total Students: {course.enrolled_students.length}
                    </p>
                </div>
            )}
        </div>
    </div>
);

export default PeopleTab;
