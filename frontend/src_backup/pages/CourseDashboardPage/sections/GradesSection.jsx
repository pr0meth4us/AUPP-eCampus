import React from "react";
import { Star } from "lucide-react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from "@heroui/react";
import { formatDate } from "../../../utils/dateUtils";

/**
 * Expects `courseData.assignments` to each have:
 *   - title, due_date, points (max grade)
 *   - final_grade (highest‐graded submission)
 *
 * We’ll display each assignment’s final_grade directly, and compute a total course grade as the average.
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

    // Compute course-wide totals
    let totalPoints = 0;
    let totalEarned = 0;
    courseData.assignments.forEach((assignment) => {
        const maxPoints = assignment.points ?? 0;
        const earned = assignment.final_grade != null ? parseFloat(assignment.final_grade) : 0;
        totalPoints += maxPoints;
        totalEarned += earned;
    });
    // If there are assignments, compute average percentage
    const coursePercentage =
        totalPoints > 0 ? ((totalEarned / totalPoints) * 100).toFixed(1) : "0.0";

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
                        const maxPoints = assignment.points ?? 0;
                        const finalGradeRaw = assignment.final_grade;
                        const yourGradeText =
                            finalGradeRaw != null ? `${finalGradeRaw}/${maxPoints}` : "No Submission";

                        // Determine status
                        let statusChip;
                        if (finalGradeRaw == null) {
                            statusChip = (
                                <Chip size="sm" color="neutral">
                                    No Submission
                                </Chip>
                            );
                        } else {
                            // Example pass threshold: 70% of maxPoints
                            const threshold = 0.7 * maxPoints;
                            const passed = parseFloat(finalGradeRaw) >= threshold;
                            statusChip = (
                                <Chip size="sm" color={passed ? "success" : "danger"}>
                                    {passed ? "Passed" : "Failed"}
                                </Chip>
                            );
                        }

                        return (
                            <TableRow key={assignment._id}>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{formatDate(assignment.due_date)}</TableCell>
                                <TableCell>{maxPoints}</TableCell>
                                <TableCell>{yourGradeText}</TableCell>
                                <TableCell>{statusChip}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-4 text-sm text-gray-500">
                <p>
                    Total Course Grade: {totalEarned}/{totalPoints} (
                    {coursePercentage}%)
                </p>
            </div>
        </div>
    );
};

export default GradesSection;
