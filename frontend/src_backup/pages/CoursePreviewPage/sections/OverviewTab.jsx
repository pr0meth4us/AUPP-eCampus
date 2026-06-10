import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { BookText, Tags } from "lucide-react";

const OverviewTab = ({ course }) => {

    return (
        <div className="space-y-6">
            <Card className="shadow-md">
                <CardBody>
                    <div className="flex items-start gap-4">
                        <BookText size={40} className="text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-bold mb-2">{course?.title || "Untitled Course"}</h3>
                            <p className="text-gray-600">{course?.description || "No description available"}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">


                {/* Tags and Majors Section */}
                <Card className="shadow-md">
                    <CardBody>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tags size={20} className="text-green-500" /> Course Categories
                            </h3>

                            <div className="space-y-4">
                                {/* Majors */}
                                <div>
                                    <p className="font-medium mb-2 text-gray-700">Majors</p>
                                    <div className="flex flex-wrap gap-2">
                                        {course?.major_names?.length ? (
                                            course.major_names.map((major, index) => (
                                                <Chip
                                                    key={index}
                                                    variant="flat"
                                                    color="primary"
                                                    size="sm"
                                                >
                                                    {major}
                                                </Chip>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No majors listed</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <p className="font-medium mb-2 text-gray-700">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {course?.tag_names?.length ? (
                                            course.tag_names.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    variant="flat"
                                                    color="secondary"
                                                    size="sm"
                                                >
                                                    {tag}
                                                </Chip>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No tags listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default OverviewTab;