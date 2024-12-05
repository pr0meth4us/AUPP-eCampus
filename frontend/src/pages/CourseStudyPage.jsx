import React, {useEffect, useState} from 'react';
import {
    Card,
    CardBody,
    Button,
    Avatar,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, Spinner
} from "@nextui-org/react";
import {
    BookOpen,
    Users,
    User,
    File,
    Clock,
    Tag
} from 'lucide-react';
import {useCourseDetails} from "../hooks/useCourseFetch";

const CourseStudyPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [selectedModule, setSelectedModule] = useState(null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const { course, loading } = useCourseDetails();

    if (loading) {
        return <Spinner />;
    }

    const renderContentPreview = (content) => {
        const isImage = content.match(/\.(jpg|jpeg|png|gif)$/i);
        const isVideo = content.match(/\.(mp4|webm|ogg)$/i);

        if (isImage) {
            return (
                <img
                    src={content}
                    alt="Content Preview"
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

        return null;
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardBody>
                                <h2 className="text-xl font-bold mb-3">Course Description</h2>
                                <p className="text-gray-600">{course.description || 'No description available'}</p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <h2 className="text-xl font-bold mb-3">Course Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Tag size={20} className="text-primary" />
                                        <span>Tags: {course.tags.join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={20} className="text-primary" />
                                        <span>Major: {course.majors.join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={20} className="text-primary" />
                                        <span>Price: {course.price === '0' ? 'Free' : `$${course.price}`}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );

            case 'modules':
                return (
                    <div className="space-y-4">
                        {course.modules.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600">No modules available for this course.</p>
                            </div>
                        ) : (
                            course.modules.map((module) => (
                                <Card
                                    key={module.id}
                                    isPressable
                                    onPress={() => {
                                        setSelectedModule(module);
                                        setIsModuleModalOpen(true);
                                    }}
                                >
                                    <CardBody className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {renderContentPreview(module.content)}
                                            <div>
                                                <h3 className="text-lg font-semibold">{module.title}</h3>
                                                <p className="text-gray-500 line-clamp-2">{module.description}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" color="primary" variant="light">
                                            View Details
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                );

            case 'people':
                return (
                    <div className="space-y-4">
                        <Card>
                            <CardBody>
                                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <User size={24} className="text-primary" /> Instructor
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        src={course.instructor.profile_image || undefined}
                                        name={course.instructor.name}
                                        size="lg"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{course.instructor.name}</h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <Users size={24} className="text-primary" /> Enrolled Students
                                </h2>
                                <div className="space-y-3">
                                    {course.enrolled_students.map((student) => (
                                        <div key={student.id} className="flex items-center space-x-3">
                                            <Avatar
                                                src={student.profile_image || undefined}
                                                name={student.name}
                                            />
                                            <span>{student.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
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
                    <img
                        src={course.cover_image_url || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h1 className="text-xl font-bold">{course.title}</h1>
                </div>

                <Divider />

                <div className="space-y-2">
                    {[
                        { key: 'overview', icon: <BookOpen />, label: 'Overview' },
                        { key: 'modules', icon: <File />, label: 'Modules' },
                        { key: 'people', icon: <Users />, label: 'People' }
                    ].map((item) => (
                        <Button
                            key={item.key}
                            fullWidth
                            variant={activeSection === item.key ? 'solid' : 'light'}
                            color="primary"
                            startContent={item.icon}
                            onPress={() => setActiveSection(item.key)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {renderSection()}
            </div>

            {/* Module Modal */}
            <Modal
                isOpen={isModuleModalOpen}
                onClose={() => setIsModuleModalOpen(false)}
                size="2xl"
            >
                <ModalContent>
                    {selectedModule && (
                        <>
                            <ModalHeader>{selectedModule.title}</ModalHeader>
                            <ModalBody>
                                {renderContentPreview(selectedModule.content)}
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold">Description</h4>
                                    <p>{selectedModule.description}</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={() => window.open(selectedModule.content, '_blank')}
                                >
                                    Open Content
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => setIsModuleModalOpen(false)}
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

export default CourseStudyPage;
