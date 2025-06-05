// src/components/PeopleSection.jsx

import React from 'react';
import { User, Users } from 'lucide-react';

const PeopleSection = ({ courseData }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <User className="mr-2 text-blue-500" />
                    Instructor
                </h2>
                <div className="flex items-center">
                    <div className="mr-4">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {courseData.people?.instructor?.name || 'No Instructor'}
                        </h3>
                        <p className="text-gray-500 text-sm">Course Instructor</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <Users className="mr-2 text-blue-500" />
                    Students
                </h2>
                <div className="space-y-2">
                    {!courseData.people?.students ||
                    courseData.people.students.length === 0 ? (
                        <p className="text-gray-500">No students enrolled</p>
                    ) : (
                        courseData.people.students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                                    <User className="text-gray-500" />
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
