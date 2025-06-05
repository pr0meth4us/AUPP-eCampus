import React from "react";
import { Card, CardBody, Avatar, Chip } from "@nextui-org/react";
import { GraduationCap, Users, Mail, Award } from "lucide-react";

const PeopleTab = ({ course }) => {
    const instructor = course?.instructor || {};
    const students = course?.students || [];

    return (
        <div className="space-y-6">
            {/* Instructor Section */}
            <Card className="shadow-md">
                <CardBody>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar
                            src={instructor.profile_image}
                            fallback={
                                <GraduationCap
                                    size={64}
                                    className="text-primary bg-primary/10 rounded-full p-3"
                                />
                            }
                            className="w-24 h-24 border-4 border-primary"
                        />
                        <div className="text-center md:text-left flex-grow">
                            <h3 className="text-xl font-bold">
                                Professor {instructor.name || "Unnamed"}
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                {instructor.email && (
                                    <Chip
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                        startContent={<Mail size={14} />}
                                    >
                                        {instructor.email}
                                    </Chip>
                                )}
                                {instructor.department && (
                                    <Chip
                                        variant="flat"
                                        color="secondary"
                                        size="sm"
                                        startContent={<Award size={14} />}
                                    >
                                        {instructor.department}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Students Section */}
            <Card className="shadow-md">
                <CardBody>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users size={24} className="text-primary" />
                            Students Enrolled
                            <Chip
                                variant="flat"
                                color="primary"
                                size="sm"
                                className="ml-2"
                            >
                                {students.length}
                            </Chip>
                        </h3>

                        {students.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Users className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600">No students have enrolled in this course yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {students.map((student) => (
                                    <Card
                                        key={student.id}
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <CardBody className="flex flex-col items-center text-center">
                                            <Avatar
                                                src={student.profile_image}
                                                fallback={
                                                    <Users
                                                        size={48}
                                                        className="text-secondary bg-secondary/10 rounded-full p-3"
                                                    />
                                                }
                                                className="w-20 h-20 mb-3 border-3 border-secondary"
                                            />
                                            <p className="font-semibold">{student.name}</p>
                                            {student.email && (
                                                <Chip
                                                    variant="flat"
                                                    color="primary"
                                                    size="sm"
                                                    className="mt-2"
                                                    startContent={<Mail size={14} />}
                                                >
                                                    {student.email}
                                                </Chip>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default PeopleTab;