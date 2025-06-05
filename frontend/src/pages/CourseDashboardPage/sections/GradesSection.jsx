// src/components/GradesSection.jsx

import React from 'react';
import { Star } from 'lucide-react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import {formatDate} from "../../../utils/dateUtils";

const GradesSection = ({ courseData }) => {
    // Temporarily find current user as “test” (adjust your logic as needed)
    const currentUser = courseData.people?.students?.find((s) => s.name === 'test');

    if (!courseData.assignments || courseData.assignments.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Star className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No grades available</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="mr-2 text-blue-500" />
                Course Grades
            </h2>

            <Table aria-label="Grades Table">
                <TableHeader>
                    <TableColumn>Assignment</TableColumn>
                    <TableColumn>Due Date</TableColumn>
                    <TableColumn>Max Grade</TableColumn>
                    <TableColumn>Your Grade</TableColumn>
                    <TableColumn>Status</TableColumn>
                </TableHeader>
                <TableBody>
                    {courseData.assignments.map((assignment) => {
                        const userSubmission = assignment.submissionsData?.find(
                            (submission) => submission.student_id === currentUser?.id
                        );

                        return (
                            <TableRow key={assignment._id}>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{formatDate(assignment.due_date)}</TableCell>
                                <TableCell>{assignment.max_grade}</TableCell>
                                <TableCell>
                                    {userSubmission
                                        ? userSubmission.grade !== null
                                            ? `${userSubmission.grade}/${assignment.max_grade}`
                                            : 'Not Graded'
                                        : 'No Submission'}
                                </TableCell>
                                <TableCell>
                                    {userSubmission ? (
                                        <Chip
                                            size="sm"
                                            color={
                                                userSubmission.grade !== null
                                                    ? userSubmission.grade >= 70
                                                        ? 'success'
                                                        : 'danger'
                                                    : 'warning'
                                            }
                                        >
                                            {userSubmission.grade !== null
                                                ? userSubmission.grade >= 70
                                                    ? 'Passed'
                                                    : 'Failed'
                                                : 'Pending'}
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" color="neutral">
                                            No Submission
                                        </Chip>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-4 text-sm text-gray-500">
                <p>Total Course Grade: Calculation Pending</p>
            </div>
        </div>
    );
};

export default GradesSection;
