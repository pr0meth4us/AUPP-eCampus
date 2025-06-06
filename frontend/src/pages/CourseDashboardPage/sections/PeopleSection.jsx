// src/components/PeopleSection.jsx

import React from 'react';
import { User, Users } from 'lucide-react';

const PeopleSection = ({ courseData }) => {
    const instructor = courseData.instructor || null;
    const students = Array.isArray(courseData.enrolled_students)
        ? courseData.enrolled_students
        : [];

    return (
        <div className="space-y-4">
            {/* Instructor Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <User className="mr-2 text-blue-500" />
                    Instructor
                </h2>
                {instructor ? (
                    <div className="flex items-center">
                        <div className="mr-4">
                            {instructor.profile_image ? (
                                <img
                                    src={instructor.profile_image}
                                    alt={instructor.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                                    <User className="text-blue-500" size={32} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {instructor.name}
                            </h3>
                            <p className="text-gray-500 text-sm">Course Instructor</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No Instructor Assigned</p>
                )}
            </div>

            {/* Students Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <Users className="mr-2 text-blue-500" />
                    Students
                </h2>
                <div className="space-y-2">
                    {students.length === 0 ? (
                        <p className="text-gray-500">No students enrolled</p>
                    ) : (
                        students.map((student) => (
                            <div
                                key={student._id}
                                className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden flex items-center justify-center">
                                    {student.profile_image ? (
                                        <img
                                            src={student.profile_image}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="text-gray-500" />
                                    )}
                                </div>
                                <span>{student.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeopleSection;
