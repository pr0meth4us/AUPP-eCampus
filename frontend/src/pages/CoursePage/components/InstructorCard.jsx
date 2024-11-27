import React from "react";
import { Card, CardBody, Avatar } from "@nextui-org/react";

const InstructorCard = ({ instructor }) => (
    <Card className="shadow-md">
        <CardBody className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                {instructor?.profile_image ? (
                    <Avatar
                        src={instructor.profile_image}
                        className="w-16 h-16 border-3 border-primary"
                    />
                ) : (
                    <Avatar
                        icon={<i className="text-white">?</i>}
                        classNames={{
                            base: "w-16 h-16 bg-gradient-to-br from-primary-300 to-primary-600",
                        }}
                    />
                )}
                <div>
                    <p className="text-lg font-semibold">{`Professor ${instructor?.name || "Instructor"}`}</p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                </div>
            </div>
        </CardBody>
    </Card>
);

export default InstructorCard;
