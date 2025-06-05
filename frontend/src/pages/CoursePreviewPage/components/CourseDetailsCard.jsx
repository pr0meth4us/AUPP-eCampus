import React from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";

const CourseDetailsCard = ({ course }) => (
    <Card className="shadow-md sticky top-6">
        <CardBody>
            <h3 className="text-xl font-bold mb-4">Course Details</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-primary">${course.price}</p>
                </div>
                <Divider />
                <div>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                    <p className="font-semibold">{course.student_count}</p>
                </div>
                <Divider />
                <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-semibold">{new Date(course.created_at).toLocaleDateString()}</p>
                </div>
                <Divider />
                <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-semibold">{new Date(course.updated_at).toLocaleDateString()}</p>
                </div>
            </div>
        </CardBody>
    </Card>
);

export default CourseDetailsCard;
