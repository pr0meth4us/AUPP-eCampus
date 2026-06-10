// src/components/AssignmentsSection.jsx

import React from 'react';
import { Clipboard, Download, ExternalLink } from 'lucide-react';
import { Chip, Button, Tooltip } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getDaysUntilDue } from '../../../utils/dateUtils';

/**
 * Shows a list of assignments for the CURRENT STUDENT.
 * Expects each assignment object in `courseData.assignments` to have:
 *   - title, description, due_date, max_grade, file (download URL)
 *   - my_submissions: array of this student’s submissions (may be empty)
 */
const AssignmentsSection = ({ courseData }) => {
    const navigate = useNavigate();

    if (!courseData.assignments || courseData.assignments.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Clipboard className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No assignments available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {courseData.assignments.map((assignment) => {
                // How many submissions the current student has made
                const myCount = assignment.my_submissions?.length || 0;

                // If they have submitted at least once, pick the latest by submitted_at
                let latestSubmission = null;
                if (myCount > 0) {
                    // assume my_submissions is already sorted oldest→newest
                    latestSubmission = assignment.my_submissions[myCount - 1];
                }

                const statusText = latestSubmission
                    ? latestSubmission.grade != null
                        ? 'Graded'
                        : 'Submitted'
                    : 'Not Submitted';

                const statusColor = latestSubmission
                    ? latestSubmission.grade != null
                        ? 'success'
                        : 'primary'
                    : 'warning';

                return (
                    <div
                        key={assignment._id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={
                                    getDaysUntilDue(assignment.due_date) === 'Overdue'
                                        ? 'danger'
                                        : 'success'
                                }
                            >
                                {getDaysUntilDue(assignment.due_date)}
                            </Chip>
                        </div>

                        <p className="text-gray-600 mb-2">{assignment.description}</p>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Due Date: {formatDate(assignment.due_date)}</p>
                                <p>Max Grade: {assignment.max_grade}</p>
                                <p>
                                    Your Submissions:{' '}
                                    <strong>{myCount > 0 ? myCount : '0'}</strong>
                                </p>
                                {latestSubmission && (
                                    <p>
                                        Last Submission:{' '}
                                        {formatDate(latestSubmission.submitted_at)} (
                                        <Chip size="xs" color={statusColor} variant="flat">
                                            {statusText}
                                        </Chip>
                                        )
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                {assignment.file && (
                                    <Tooltip content="Download Assignment">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            startContent={<Download size={16} />}
                                            onClick={() => window.open(assignment.file, '_blank')}
                                        >
                                            Download
                                        </Button>
                                    </Tooltip>
                                )}
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    startContent={<ExternalLink size={16} />}
                                    onClick={() =>
                                        navigate(
                                            `/courses/${courseData._id}/assignments/${assignment._id}`
                                        )
                                    }
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssignmentsSection;
