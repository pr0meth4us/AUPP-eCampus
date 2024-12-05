import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    User,
    File,
    Clock,
    Tag,
    Clipboard
} from 'lucide-react';
import {useCourseDetails} from "../hooks/useCourseFetch";
import {Spinner} from "@nextui-org/react";

const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString()
    } catch {
        return 'Invalid Date'
    }
};

const CourseStudyPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const { course: courseData, loading } = useCourseDetails();
    if (loading) {
        return <Spinner />;
    }
    console.log(courseData);


    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-3">Course Description</h2>
                            <p className="text-gray-600">
                                {courseData.course.description || 'No description available'}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-3">Course Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Tag className="mr-2 text-blue-500" />
                                    <span>Tags: {courseData.course.tag_names?.join(', ') || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="mr-2 text-blue-500" />
                                    <span>Major: {courseData.course.major_names?.join(', ') || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 text-blue-500" />
                                    <span>Price: {courseData.course.price === '0' ? 'Free' : `$${courseData.course.price}`}</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="mr-2 text-blue-500" />
                                    <span>Students: {courseData.course.student_count || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'modules':
                return (
                    <div className="space-y-4">
                        {courseData.modules.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600">No modules available</p>
                            </div>
                        ) : (
                            courseData.modules.map((module) => (
                                <div key={module._id} className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">{module.title}</h3>
                                    <p className="text-gray-500">{module.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'assignments':
                return (
                    <div className="space-y-4">
                        {courseData.assignments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Clipboard className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600">No assignments available</p>
                            </div>
                        ) : (
                            courseData.assignments.map((assignment) => (
                                <div key={assignment._id} className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                                    <p className="text-gray-600">{assignment.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Due Date: {formatDate(assignment.due_date)}</p>
                                        <p>Max Grade: {assignment.max_grade}</p>
                                    </div>
                                    {assignment.submissions && (
                                        <div className="mt-2">
                                            <h4 className="font-medium">Submissions: {assignment.submissions.length}</h4>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'people':
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
                                        <User className="text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {courseData.people.instructor.name || 'No Instructor'}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-3 flex items-center">
                                <Users className="mr-2 text-blue-500" />
                                Students
                            </h2>
                            <div className="space-y-2">
                                {courseData.people.students.length === 0 ? (
                                    <p className="text-gray-500">No students enrolled</p>
                                ) : (
                                    courseData.people.students.map((student) => (
                                        <div key={student.id} className="flex items-center">
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
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-6 space-y-4">
                <div className="text-center">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    </div>
                    <h1 className="text-xl font-bold">{courseData.course.title || 'Untitled Course'}</h1>
                </div>

                <div className="border-t my-4"></div>

                <div className="space-y-2">
                    {[
                        { key: 'overview', icon: BookOpen, label: 'Overview' },
                        { key: 'modules', icon: File, label: 'Modules' },
                        { key: 'people', icon: Users, label: 'People' },
                        { key: 'assignments', icon: Clipboard, label: 'Assignments' }
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveSection(item.key)}
                            className={`w-full text-left p-2 rounded flex items-center ${
                                activeSection === item.key
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className="mr-2" size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default CourseStudyPage;