// src/components/CourseSidebar.jsx

import React from 'react';
import { BookOpen, File, Users, Clipboard, Star } from 'lucide-react';
import { Button } from '@nextui-org/react';
import {formatDate} from "../../../utils/dateUtils";

const CourseSidebar = ({ courseData, activeSection, onSelectSection }) => {
    return (
        <div className="w-64 bg-white shadow-md p-6 space-y-4">
            <div className="text-center">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    {courseData.cover_image_url ? (
                        <img
                            src={courseData.cover_image_url}
                            alt="Course Cover"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        <BookOpen className="text-gray-500" size={48} />
                    )}
                </div>
                <h1 className="text-xl font-bold">
                    {courseData.title || 'Untitled Course'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Created: {formatDate(courseData.created_at)}
                </p>
            </div>

            <div className="border-t my-4"></div>

            <div className="space-y-2">
                {[
                    { key: 'overview', icon: BookOpen, label: 'Overview' },
                    { key: 'modules', icon: File, label: 'Modules' },
                    { key: 'people', icon: Users, label: 'People' },
                    { key: 'assignments', icon: Clipboard, label: 'Assignments' },
                    { key: 'grades', icon: Star, label: 'Grades' }
                ].map((item) => (
                    <Button
                        key={item.key}
                        onClick={() => onSelectSection(item.key)}
                        className={`w-full text-left p-2 rounded flex items-center transition-colors ${
                            activeSection === item.key
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <item.icon className="mr-2" size={20} />
                        {item.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CourseSidebar;
