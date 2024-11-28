import React from "react";
import { Chip } from "@nextui-org/react";
import { Tag } from "lucide-react";

const OverviewTab = ({ course }) => (
    <div className="mt-4 space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-3">About This Course</h3>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Majors</h3>
                <div className="flex flex-wrap gap-2">
                    {course.major_names?.length ? (
                        course.major_names.map((major, index) => (
                            <Chip
                                key={index}
                                startContent={<Tag size={14} />}
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
            <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {course.tag_names?.length ? (
                        course.tag_names.map((tag, index) => (
                            <Chip
                                key={index}
                                startContent={<Tag size={14} />}
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
);

export default OverviewTab;
