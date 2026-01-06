// components/AssignmentsSection.jsx

import React from "react";
import { Card, CardHeader, CardBody, Button, Chip, Switch, Tooltip } from "@heroui/react";
import { PlusIcon, EyeIcon, TrashIcon, CalendarIcon } from "@heroicons/react/24/outline";

const AssignmentsSection = ({
                                assignments,
                                onAddAssignment,
                                onPublishAssignment,
                                onDeleteAssignment,
                                onViewSubmissions,
                                submissionsLoading,
                                viewingAssignmentId,
                            }) => {
    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Assignments ({assignments.length})</h3>
                <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onAddAssignment}>
                    Create Assignment
                </Button>
            </CardHeader>
            <CardBody>
                {assignments.length > 0 ? (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <Card key={assignment._id} className="border shadow-sm">
                                <CardBody>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-semibold text-md">{assignment.title}</h4>
                                                <Chip
                                                    size="sm"
                                                    color={assignment.is_published ? "success" : "warning"}
                                                    variant="flat"
                                                >
                                                    {assignment.is_published ? "Published" : "Draft"}
                                                </Chip>
                                            </div>
                                            <p className="text-gray-600 mb-2 text-sm whitespace-pre-wrap">
                                                {assignment.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                <span>Points: {assignment.points || 100}</span>
                                                {assignment.due_date && (
                                                    <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>
                              Due:{" "}
                                {new Date(assignment.due_date).toLocaleDateString()}{" "}
                                {new Date(assignment.due_date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                          </span>
                                                )}
                                                <span>Submissions: {assignment.submissions?.length || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                                            <Tooltip content={assignment.is_published ? "Unpublish" : "Publish"}>
                                                <Switch
                                                    isSelected={!!assignment.is_published}
                                                    onValueChange={(isSelected) =>
                                                        onPublishAssignment(assignment._id, isSelected)
                                                    }
                                                    size="sm"
                                                />
                                            </Tooltip>
                                            <Tooltip content="View Submissions">
                                                <Button
                                                    isLoading={submissionsLoading && viewingAssignmentId === assignment._id}
                                                    color="default"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => onViewSubmissions(assignment)}
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Delete Assignment" color="danger">
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => onDeleteAssignment(assignment._id)}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No assignments created yet.</p>
                )}
            </CardBody>
        </Card>
    );
};

export default AssignmentsSection;
