import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardFooter,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Chip
} from "@nextui-org/react";
import { BookOpen, FileText, Lock } from 'lucide-react';

const ModulesTab = ({ modules }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewModule = (module) => {
        setSelectedModule(module);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedModule(null);
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {modules.map((module) => (
                <Card
                    key={module._id}
                    className="hover:shadow-lg transition-all duration-300"
                    isPressable
                    onPress={() => handleViewModule(module)}
                >
                    <CardBody className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">{module.title}</h3>
                            {module.materials?.length > 0 && (
                                <Chip size="sm" variant="flat" color="primary">
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
                            startContent={<BookOpen size={16} />}
                        >
                            View Module
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {selectedModule && (
                        <>
                            <ModalHeader className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold">{selectedModule.title}</h2>
                                <Chip
                                    variant="flat"
                                    color="primary"
                                    size="sm"
                                >
                                    Created: {new Date(selectedModule.created_at).toLocaleDateString()}
                                </Chip>
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Description</h4>
                                    <p className="text-gray-600">
                                        {selectedModule.description || 'No description available'}
                                    </p>
                                </div>
                                {selectedModule.materials?.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold mb-2">Materials</h4>
                                        <div className="space-y-2">
                                            {selectedModule.materials.map((material, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={20} className="text-primary" />
                                                        <span>{material.name || `Material ${index + 1}`}</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                    >
                                                        Download
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleCloseModal}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ModulesTab;