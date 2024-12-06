import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { BookOpen, Download } from "lucide-react";

const AssignmentsTab = ({ assignments }) => (
    <div className="mt-4">
        {assignments?.length > 0 ? (
            <div className="space-y-4">
                {assignments.map((assignment, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen size={20} className="text-primary" />
                                <div>
                                    <p className="font-medium">{assignment.title}</p>
                                    <p className="text-sm text-gray-500">
                                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<Download size={16} />}
                            >
                                Download
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">
                No assignments available for this course.
            </p>
        )}
    </div>
);

export default AssignmentsTab;
