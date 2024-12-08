import React from "react";
import { Card, CardBody, Avatar } from "@nextui-org/react";

const InstructorCard = ({ instructor_name, instructor_pfp }) => (
    <Card className="shadow-md">
        <CardBody className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                {instructor_pfp ? (
                    <img
                        src={instructor_pfp}
                        className="w-16 h-16 object-cover rounded-full border-3 border-primary transition-opacity duration-500 "
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
                    <p className="text-lg font-semibold">{`Professor ${instructor_name || "Instructor"}`}</p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                </div>
            </div>
        </CardBody>
    </Card>
);

export default InstructorCard;
