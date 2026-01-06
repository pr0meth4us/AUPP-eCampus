// components/StudentsSection.jsx

import React from "react";
import { Card, CardHeader, CardBody, Button, Avatar, Tooltip } from "@heroui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const StudentsSection = ({ enrolledStudents, onEnroll, onUnenroll }) => {
    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                    Enrolled Students ({enrolledStudents.length})
                </h3>
                <Button
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={onEnroll}
                >
                    Enroll Student
                </Button>
            </CardHeader>

            <CardBody>
                {enrolledStudents.length > 0 ? (
                    <div className="space-y-3">
                        {enrolledStudents.map((student) => (
                            <div
                                key={student._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {/* Avatar + Name + Email */}
                                <div className="flex items-center space-x-3">
                                    <Avatar
                                        size="md"
                                        src={student.profile_image || undefined}
                                        name={student.name}
                                    />
                                    <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-gray-600">{student.email}</p>
                                    </div>
                                </div>

                                {/* Unenroll button */}
                                <Tooltip content="Unenroll Student" color="danger">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        size="sm"
                                        isIconOnly
                                        onPress={() => onUnenroll(student._id)}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </Button>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No students enrolled yet.</p>
                )}
            </CardBody>
        </Card>
    );
};

export default StudentsSection;
