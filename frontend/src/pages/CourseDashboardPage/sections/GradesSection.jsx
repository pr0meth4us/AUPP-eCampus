// src/components/GradesSection.jsx

import React from 'react';
import { Star } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from '@nextui-org/react';
import { formatDate } from '../../../utils/dateUtils';

/**
 * Expects `courseData.assignments` to each have:
 *   - title, due_date, max_grade
 *   - my_submissions: [ ... ]  (array of this student’s submissions)
 *
 * For grading status, we look at the **latest** submission in `my_submissions`.
 */
const GradesSection = ({ courseData }) => {
    // If no assignments at all:
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
                        // Pull this student's submissions array:
                        const submissions = assignment.my_submissions || [];
                        let latest = null;
                        if (submissions.length > 0) {
                            // assume sorted; take last element
                            latest = submissions[submissions.length - 1];
                        }

                        // Determine what to show in “Your Grade” and “Status”:
                        let yourGradeText = 'No Submission';
                        let statusChip = (
                            <Chip size="sm" color="neutral">
                                No Submission
                            </Chip>
                        );

                        if (latest) {
                            if (latest.grade !== null && latest.grade !== undefined) {
                                yourGradeText = `${latest.grade}/${assignment.max_grade}`;
                                const passed = latest.grade >= 70; // or whatever pass threshold
                                statusChip = (
                                    <Chip size="sm" color={passed ? 'success' : 'danger'}>
                                        {passed ? 'Passed' : 'Failed'}
                                    </Chip>
                                );
                            } else {
                                yourGradeText = 'Pending';
                                statusChip = (
                                    <Chip size="sm" color="warning">
                                        Pending
                                    </Chip>
                                );
                            }
                        }

                        return (
                            <TableRow key={assignment._id}>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{formatDate(assignment.due_date)}</TableCell>
                                <TableCell>{assignment.max_grade}</TableCell>
                                <TableCell>{yourGradeText}</TableCell>
                                <TableCell>{statusChip}</TableCell>
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
