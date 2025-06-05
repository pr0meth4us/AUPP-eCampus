// src/pages/AssignmentDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { course, assignment as assignmentApi } from '../services';
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
    ModalFooter,
    Spinner,
    Tooltip,
} from '@nextui-org/react';
import { Upload, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

export const AssignmentDetailPage = () => {
    const { assignmentId, courseId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [loadingAssignment, setLoadingAssignment] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submissionNote, setSubmissionNote] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Fetch assignment details on mount or when courseId/assignmentId changes
    useEffect(() => {
        const fetchAssignment = async () => {
            setLoadingAssignment(true);
            setFetchError(null);
            try {
                const assignmentData = await course.getAssignmentById(courseId, assignmentId);
                setAssignment(assignmentData);
            } catch (error) {
                console.error('Failed to fetch assignment:', error);
                setFetchError(error);
            } finally {
                setLoadingAssignment(false);
            }
        };
        fetchAssignment();
    }, [courseId, assignmentId]);

    // Format the date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handler for file input
    const handleFileUpload = (event) => {
        const file = event.target.files[0] || null;
        setSubmissionFile(file);
    };

    // Modified Submission Logic with success message
    const handleSubmitAssignment = async () => {
        if (!submissionFile) {
            setSubmitError('Please select a file before submitting.');
            return;
        }
        setSubmitError('');
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('content', submissionNote);
            formData.append('files', submissionFile);

            await assignmentApi.submitAssignment(courseId, assignmentId, formData);

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);

            setIsSubmitModalOpen(false);
            setSubmissionFile(null);
            setSubmissionNote('');

            // Re-fetch assignment details so submission status updates
            const updated = await course.getAssignmentById(courseId, assignmentId);
            setAssignment(updated);
        } catch (error) {
            console.error('Submission failed:', error);
            setSubmitError(
                (error.response && error.response.data && error.response.data.error) ||
                'Failed to submit. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Get submission status color and text
    const getSubmissionStatusDisplay = (submission) => {
        if (!submission) return { color: 'warning', text: 'Not Submitted' };

        if (submission.grade !== null && submission.grade !== undefined) {
            return { color: 'success', text: 'Graded' };
        }

        return { color: 'primary', text: 'Submitted' };
    };

    // Loading state
    if (loadingAssignment) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Spinner size="xl" />
                <p className="mt-4 text-gray-600">Loading assignment...</p>
            </div>
        );
    }

    // Fetch error state
    if (fetchError) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-red-400" size={64} />
                <h1 className="text-2xl font-bold text-red-600">
                    Error loading assignment
                </h1>
                <p className="text-gray-500 mt-2">{fetchError.message}</p>
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

    // If assignment object is null or undefined
    if (!assignment) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <XCircle className="mx-auto mb-4 text-gray-400" size={64} />
                <h1 className="text-2xl font-bold text-gray-600">Assignment Not Found</h1>
                <p className="text-gray-500 mt-2">
                    The requested assignment does not exist.
                </p>
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

    const submissionStatus = getSubmissionStatusDisplay(assignment.my_submission);

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Show a temporary success message right after submission */}
            {showSuccessMessage && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                    <p>Assignment submitted successfully!</p>
                </div>
            )}

            <Card className="max-w-4xl mx-auto">
                <CardBody className="space-y-6">
                    {/* Header: Title + Lock/Active status */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{assignment.title}</h1>
                        <div className="flex gap-2">
                            <Chip color={submissionStatus.color} variant="flat">
                                {submissionStatus.text}
                            </Chip>
                            <Chip color={assignment.is_locked ? 'danger' : 'success'} variant="flat">
                                {assignment.is_locked ? 'Locked' : 'Active'}
                            </Chip>
                        </div>
                    </div>

                    {/* Details: Due date, max grade, view link */}
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
                                <Tooltip content="View the assignment prompt">
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        startContent={<Eye size={16} />}
                                        onPress={() => window.open(assignment.file, '_blank')}
                                    >
                                        View Assignment
                                    </Button>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{assignment.description}</p>
                    </div>

                    {/* SECTION: "Your Submission" or "Not yet submitted" */}
                    {assignment.my_submission ? (
                        <div className="my-4 p-4 bg-gray-100 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-2">Your Submission</h3>

                            {/* Status */}
                            <p>
                                <span className="font-medium">Status:</span>{' '}
                                <Chip size="sm" color={submissionStatus.color} variant="flat">
                                    {submissionStatus.text}
                                </Chip>
                            </p>

                            {/* Download links for ALL submitted files */}
                            {assignment.my_submission.file_urls &&
                                assignment.my_submission.file_urls.length > 0 && (
                                    <div className="mt-2">
                                        <span className="font-medium">Submitted Files:</span>
                                        <div className="mt-1 space-y-1">
                                            {assignment.my_submission.file_urls.map((fileUrl, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Download size={16} className="text-blue-600" />
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        {assignment.my_submission.file_names?.[index] ||
                                                            `Submitted file ${index + 1}`}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Submission content/notes */}
                            {assignment.my_submission.content && (
                                <div className="mt-2">
                                    <span className="font-medium">Notes:</span>
                                    <p className="text-gray-700 mt-1 p-2 bg-white rounded border">
                                        {assignment.my_submission.content}
                                    </p>
                                </div>
                            )}

                            {/* Submitted at */}
                            <p className="mt-2">
                                <span className="font-medium">Submitted at:</span>{' '}
                                {formatDate(assignment.my_submission.submitted_at)}
                            </p>

                            {/* Grade & Feedback (if present) */}
                            {assignment.my_submission.grade !== null &&
                                assignment.my_submission.grade !== undefined && (
                                    <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-2">Grading Results</h4>
                                        <p className="mb-2">
                                            <span className="font-medium">Grade:</span>{' '}
                                            <span className="text-green-700 font-bold">
                                                {assignment.my_submission.grade} / {assignment.max_grade}
                                            </span>
                                        </p>
                                        <div>
                                            <span className="font-medium">Feedback:</span>
                                            <p className="text-gray-700 mt-1 p-2 bg-white rounded border">
                                                {assignment.my_submission.feedback ||
                                                    'No feedback provided yet.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className="my-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                            <p>You have not submitted this assignment yet.</p>
                        </div>
                    )}

                    {/* Submit Button (allow resubmit if assignment not locked) */}
                    <div>
                        <Button
                            color="primary"
                            startContent={<Upload size={16} />}
                            onPress={() => setIsSubmitModalOpen(true)}
                            isDisabled={assignment.is_locked}
                        >
                            {assignment.my_submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Submit Modal */}
            <Modal
                isOpen={isSubmitModalOpen}
                onClose={() => {
                    if (!submitting) {
                        setSubmitError('');
                        setIsSubmitModalOpen(false);
                    }
                }}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>
                        {assignment.my_submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            {/* File Input */}
                            <div>
                                <label className="block mb-2 font-medium">Upload File</label>
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

                            {/* Notes Textarea */}
                            <Textarea
                                label="Submission Notes"
                                placeholder="Add any additional notes for your submission"
                                value={submissionNote}
                                onChange={(e) => setSubmissionNote(e.target.value)}
                            />

                            {/* Warning for resubmission */}
                            {assignment.my_submission && (
                                <div className="p-3 bg-orange-100 border border-orange-300 rounded">
                                    <p className="text-orange-700 text-sm">
                                        <strong>Note:</strong> This will replace your previous submission.
                                    </p>
                                </div>
                            )}

                            {/* Any submission error */}
                            {submitError && (
                                <p className="text-red-500 text-sm">{submitError}</p>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                                if (!submitting) {
                                    setSubmitError('');
                                    setIsSubmitModalOpen(false);
                                }
                            }}
                            isDisabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmitAssignment}
                            isDisabled={!submissionFile || submitting}
                        >
                            {submitting ? <Spinner size="sm" /> : (assignment.my_submission ? 'Resubmit' : 'Submit')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};