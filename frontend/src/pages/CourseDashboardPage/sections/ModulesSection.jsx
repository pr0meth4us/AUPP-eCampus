// src/components/ModulesSection.jsx

import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Chip, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

const ModulesSection = ({ courseData }) => {
    const navigate = useNavigate();

    if (!courseData.modules || courseData.modules.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No modules available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {courseData.modules.map((module) => (
                <div
                    key={module._id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            {module.title || 'Untitled Module'}
                        </h3>
                        {module.materials?.length > 0 && (
                            <Chip size="sm" variant="flat" color="primary">
                                {module.materials.length} Materials
                            </Chip>
                        )}
                    </div>
                    <p className="text-gray-500 mb-2">
                        {module.description || 'No description available'}
                    </p>
                    <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        startContent={<ExternalLink size={16} />}
                        onClick={() =>
                            navigate(`/courses/${courseData._id}/modules/${module._id}`)
                        }
                    >
                        View Module Details
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default ModulesSection;
