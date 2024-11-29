import React from "react";
import { Card, CardBody, Progress } from "@nextui-org/react";
import { BookOpen, TrendingUp, Award } from "lucide-react";

const GradesTab = ({ assignments }) => {
    // If no assignments data is passed, show a placeholder
    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Award className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Grades Available
                </h3>
                <p className="text-gray-500">
                    Your grades will be displayed here once assignments are graded.
                </p>
            </div>
        );
    }

    const totalAssignments = assignments.length;
    const gradedAssignments = assignments.filter(a => a.submissionsData?.length > 0);
    const avgGrade = gradedAssignments.length
        ? gradedAssignments.reduce((sum, a) => sum + parseFloat(a.max_grade || 0), 0) / gradedAssignments.length
        : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <TrendingUp size={32} className="text-primary" />
                            <div>
                                <h3 className="text-xl font-semibold">Grade Overview</h3>
                                <p className="text-gray-600">
                                    {gradedAssignments.length} of {totalAssignments} assignments graded
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                                {avgGrade.toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-500">Average Grade</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <div className="flex items-center gap-4 mb-4">
                        <BookOpen size={24} className="text-primary" />
                        <h4 className="text-lg font-semibold">Assignment Grades</h4>
                    </div>
                    {assignments.map((assignment, index) => (
                        <div
                            key={assignment._id}
                            className="mb-4 last:mb-0 border-b pb-4 last:border-b-0"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{assignment.title}</span>
                                <span className="text-sm text-gray-500">
                                    Max Grade: {assignment.max_grade}
                                </span>
                            </div>
                            <Progress
                                value={assignment.submissionsData?.length ? 100 : 0}
                                color={assignment.submissionsData?.length ? "success" : "default"}
                                label={assignment.submissionsData?.length ? "Submitted" : "Not Submitted"}
                            />
                        </div>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
};

export default GradesTab;