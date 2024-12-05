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
    ModalFooter
} from "@nextui-org/react";
import { ImageIcon, FileText } from 'lucide-react';

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

    const renderContentPreview = (content) => {
        const isImage = content.match(/\.(jpg|jpeg|png|gif)$/i);
        const isVideo = content.match(/\.(mp4|webm|ogg)$/i);

        if (isImage) {
            return (
                <img
                    src={content}
                    alt="Module Content"
                    className="w-full h-48 object-cover rounded-xl"
                />
            );
        }

        if (isVideo) {
            return (
                <video
                    src={content}
                    controls
                    className="w-full h-48 rounded-xl"
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-xl">
                <FileText className="text-gray-500" size={48} />
            </div>
        );
    };

    if (!modules || modules.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No modules available for this course.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {modules.map((module) => (
                <Card
                    key={module.id}
                    className="hover:shadow-lg transition-all duration-300"
                    isPressable
                    onPress={() => handleViewModule(module)}
                >
                    {renderContentPreview(module.content)}
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{module.description}</p>
                    </CardBody>
                    <CardFooter>
                        <Button
                            fullWidth
                            color="primary"
                            variant="flat"
                        >
                            View Module Details
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
                            <ModalHeader>
                                {selectedModule.title}
                            </ModalHeader>
                            <ModalBody>
                                {renderContentPreview(selectedModule.content)}
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold">Description</h4>
                                    <p className="text-gray-600">{selectedModule.description}</p>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href={selectedModule.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-2"
                                    >
                                        <FileText /> Open Full Content
                                    </a>
                                </div>
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