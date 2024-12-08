import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { course } from "../services";
import {
    Card,
    CardBody,
    Button,
    Chip,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import {
    Download,
    Upload,
    Clock,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';

export const AssignmentDetailPage = () => {
    const { assignmentId, courseId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submissionNote, setSubmissionNote] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const assignmentData = await course.getAssignmentById(courseId, assignmentId);
                setAssignment(assignmentData);
            } catch (error) {
                console.error("Failed to fetch assignment:", error);
            }
        };
        fetchAssignment();
    }, [courseId, assignmentId]);

    if (assignment === null) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Clock className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Assignment Not Found</h1>
                <p className="text-gray-500 mt-2">The requested assignment does not exist.</p>
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

    // Format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSubmissionFile(file);
    };

    const handleSubmitAssignment = () => {
        // TODO: Implement actual submission logic
        console.log('Submitting assignment', {
            file: submissionFile,
            note: submissionNote
        });
        setIsSubmitModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardBody className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{assignment.title}</h1>
                        <Chip
                            color={assignment.is_locked ? 'danger' : 'success'}
                            variant="flat"
                        >
                            {assignment.is_locked ? 'Locked' : 'Active'}
                        </Chip>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-gray-500" />
                                <span>Due Date: {formatDate(assignment.due_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                <span>Maximum Grade: {assignment.max_grade}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {assignment.file && (
                                <Button
                                    color="primary"
                                    variant="flat"
                                    startContent={<Eye size={16} />} // Use an "eye" icon to represent "view" if available
                                    onPress={() => window.open(assignment.file, '_blank')}
                                >
                                    View Assignment
                                </Button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{assignment.description}</p>
                    </div>

                    <div className="space-y-2">
                        <Button
                            color="primary"
                            startContent={<Upload size={16} />}
                            onPress={() => setIsSubmitModalOpen(true)}
                            isDisabled={assignment.is_locked}
                        >
                            Submit Assignment
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <Modal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>Submit Assignment</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Upload File</label>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="w-full border rounded p-2"
                                />
                                {submissionFile && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Selected: {submissionFile.name}
                                    </p>
                                )}
                            </div>
                            <Textarea
                                label="Submission Notes"
                                placeholder="Add any additional notes for your submission"
                                value={submissionNote}
                                onChange={(e) => setSubmissionNote(e.target.value)}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => setIsSubmitModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmitAssignment}
                            isDisabled={!submissionFile}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
