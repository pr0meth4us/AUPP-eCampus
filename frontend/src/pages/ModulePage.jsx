import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { course } from "../services";  // Assuming you have a service to fetch data
import {
    Card,
    CardBody,
    Button,
    Chip,
} from "@nextui-org/react";
import {
    FileText,
    XCircle,
    Link as LinkIcon
} from 'lucide-react';

export const ModuleDetailPage = () => {
    const { moduleId, courseId } = useParams();
    const navigate = useNavigate();

    // State for module data and loading state
    const [module, setModule] = useState(null);

    // Fetch module data on component mount
    useEffect(() => {
        const fetchModule = async () => {
            try {
                const fetchedModule = await course.getModuleById(courseId, moduleId);
                setModule(fetchedModule);
            } catch (error) {
                console.error("Failed to fetch module:", error);
                setModule(null); // Handle error by setting module to null
            }
        };
        fetchModule();
    }, [courseId, moduleId]);

    // If the module is still loading
    if (module === null) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
            </div>
        );
    }

    // If module not found
    if (!module) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Module Not Found</h1>
                <p className="text-gray-500 mt-2">The requested module does not exist.</p>
                <Button
                    color="primary"
                    variant="flat"
                    className="mt-4"
                    onPress={() => navigate(`/courses/${courseId}`)}
                >
                    Back to Course
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardBody className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            {module.title || 'Untitled Module'}
                        </h1>
                        {module.materials?.length > 0 && (
                            <Chip size="sm" variant="flat" color="primary">
                                {module.materials.length} Materials
                            </Chip>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">
                            {module.description || 'No description available'}
                        </p>
                    </div>

                    {module.materials && module.materials.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Learning Materials</h3>
                            <div className="space-y-3">
                                {module.materials.map((material, index) => (
                                    <Card key={index} isPressable>
                                        <CardBody className="flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText size={24} className="text-primary" />
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {material.title || `Material ${index + 1}`}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {material.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {material.content_url && (
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                        startContent={<LinkIcon size={16} />}
                                                        onPress={() => navigate(`/courses/${courseId}/modules/${moduleId}/materials/${material._id}`)}
                                                    >
                                                        View Material
                                                    </Button>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};
