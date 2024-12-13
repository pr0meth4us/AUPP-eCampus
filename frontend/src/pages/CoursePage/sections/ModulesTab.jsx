import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardFooter,
    Button,
    Chip,
} from "@nextui-org/react";
import {
    Lock,
    ExternalLink
} from 'lucide-react';

export const ModulesTab = ({ modules, courseId }) => {
    const navigate = useNavigate();

    const handleViewModule = (moduleId) => {
        navigate(`/courses/${courseId}/modules/${moduleId}`);
    };

    if (!modules || modules.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Lock className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No modules available for this course.</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for course content.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
                <Card
                    key={module._id}
                    className="hover:shadow-lg transition-all duration-300"
                    isPressable
                    onPress={() => handleViewModule(module._id)}
                >
                    <CardBody className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">
                                {module.title || 'Untitled Module'}
                            </h3>
                            {module.materials?.length > 0 && (
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                >
                                    {module.materials.length} Materials
                                </Chip>
                            )}
                        </div>
                        <p className="text-gray-600 line-clamp-3 flex-grow">
                            {module.description || 'No description available'}
                        </p>
                    </CardBody>
                    <CardFooter>
                        <Button
                            fullWidth
                            color="primary"
                            variant="flat"
                            startContent={<ExternalLink size={16} />}
                        >
                            Explore Module
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
