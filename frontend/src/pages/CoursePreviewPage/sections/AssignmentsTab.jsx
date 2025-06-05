import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardBody,
    Button,
    Chip,
    Tooltip
} from "@nextui-org/react";
import {
    BookOpen,
    Download,
    CalendarClock,
} from 'lucide-react';
export const AssignmentsTab = ({ assignments, courseId }) => {
    const navigate = useNavigate();

    const formatDueDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysUntilDue = (dateString) => {
        const dueDate = new Date(dateString);
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Due Today';
        return `${diffDays} days left`;
    };

    const handleViewAssignment = (assignmentId) => {
        navigate(`/courses/${courseId}/assignments/${assignmentId}`);
    };

    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center bg-gray-50 rounded-lg py-8">
                <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No assignments available for this course.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assignments.map((assignment) => (
                <Card
                    key={assignment._id}
                    className="hover:shadow-md transition-shadow"
                    isPressable
                    onPress={() => handleViewAssignment(assignment._id)}
                >
                    <CardBody className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-grow">
                            <BookOpen size={24} className="text-primary hidden md:block" />
                            <div>
                                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {assignment.description || 'No description available'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <CalendarClock size={16} className="text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        Due: {formatDueDate(assignment.due_date)}
                                    </span>
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
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip content="Maximum possible grade">
                                <Chip
                                    variant="flat"
                                    color="primary"
                                    size="sm"
                                >
                                    Max Grade: {assignment.max_grade}
                                </Chip>
                            </Tooltip>
                            <Tooltip
                                content={
                                    assignment.file
                                        ? 'Download assignment file'
                                        : 'No file available'
                                }
                            >
                                <Button
                                    color="primary"
                                    variant="flat"
                                    startContent={<Download size={16} />}
                                    size="sm"
                                    isDisabled={!assignment.file}
                                    onPress={() => assignment.file && window.open(assignment.file, '_blank')}
                                >
                                    {assignment.file ? 'Download' : 'No File'}
                                </Button>
                            </Tooltip>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};