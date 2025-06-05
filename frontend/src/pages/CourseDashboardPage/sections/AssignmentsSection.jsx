// src/components/AssignmentsSection.jsx

import React from 'react';
import { Clipboard, Download, ExternalLink } from 'lucide-react';
import { Chip, Button, Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import {formatDate, getDaysUntilDue} from "../../../utils/dateUtils";

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
            {courseData.assignments.map((assignment) => (
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
                    {assignment.submissions && (
                        <div className="mt-2 text-sm text-gray-500">
                            <p>Submissions: {assignment.submissions.length}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AssignmentsSection;
