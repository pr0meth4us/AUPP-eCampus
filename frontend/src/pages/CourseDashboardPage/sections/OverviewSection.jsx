// src/components/OverviewSection.jsx

import React from 'react';
import { BookOpen, Clock, Tag, Users } from 'lucide-react';

const OverviewSection = ({ courseData }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3">Course Description</h2>
                <p className="text-gray-600">
                    {courseData.description || 'No description available'}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3">Course Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        {
                            icon: Tag,
                            label: 'Tags',
                            value: courseData.tag_names?.join(', ') || 'N/A'
                        },
                        {
                            icon: BookOpen,
                            label: 'Major',
                            value: courseData.major_names?.join(', ') || 'N/A'
                        },
                        {
                            icon: Clock,
                            label: 'Price',
                            value: courseData.price === '0' ? 'Free' : `$${courseData.price}`
                        },
                        {
                            icon: Users,
                            label: 'Students',
                            value: courseData.student_count || 0
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center">
                            <item.icon className="mr-2 text-blue-500" />
                            <span>
                {item.label}: {item.value}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
