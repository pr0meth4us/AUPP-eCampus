import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, Chip, Avatar, Divider, Spinner, Button, Tab, Tabs } from "@nextui-org/react";
import { Calendar, Users, Tag, BookOpen, Download } from "lucide-react";
import { user, course as CourseApi } from "../../services";

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("overview");

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const courseData = await CourseApi.getCourseById(id);
            if (!courseData) throw new Error("Course data not found");

            const instructorData = await user.getName(courseData.instructor_id);
            setCourse(courseData);
            setInstructor(instructorData);
        } catch (error) {
            console.error("Failed to fetch course data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Course not found or data unavailable.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="w-full aspect-video bg-black rounded-lg mb-6 overflow-hidden">
                    <img
                        alt={`Cover for ${course.title}`}
                        className="w-full h-full object-cover"
                        src={course.cover_image || "/AUPP-Main-Logo.svg"}
                        onError={(e) => {
                            e.target.src = "/AUPP-Main-Logo.svg";
                            e.target.classList.add("opacity-50");
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            <CardBody>
                                <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar
                                        src={instructor?.avatar_url || "/AUPP-Main-Logo.svg"}
                                        className="w-10 h-10"
                                    />
                                    <div>
                                        <p className="font-medium">{instructor?.name || "Instructor"}</p>
                                        <p className="text-sm text-gray-500">Course Instructor</p>
                                    </div>
                                </div>

                                <Tabs
                                    selectedKey={selectedTab}
                                    onSelectionChange={setSelectedTab}
                                    className="mb-6"
                                >
                                    <Tab key="overview" title="Overview">
                                        <div className="mt-4 space-y-4">
                                            <h3 className="text-lg font-semibold">About This Course</h3>
                                            <p className="text-gray-600">{course.description}</p>

                                            <div className="flex flex-wrap gap-3 mt-4">
                                                <Chip
                                                    startContent={<Calendar size={16} />}
                                                    variant="flat"
                                                >
                                                    {new Date(course.created_at).toLocaleDateString()}
                                                </Chip>
                                                <Chip
                                                    startContent={<Users size={16} />}
                                                    variant="flat"
                                                >
                                                    {course.enrolled_students?.length || 0} Students
                                                </Chip>
                                                {course.tag_ids?.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        startContent={<Tag size={16} />}
                                                        variant="flat"
                                                    >
                                                        {tag}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab key="assignments" title="Assignments">
                                        <div className="mt-4">
                                            {course.assignments?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {course.assignments.map((assignment, index) => (
                                                        <Card key={index}>
                                                            <CardBody className="flex flex-row items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <BookOpen size={20} />
                                                                    <div>
                                                                        <p className="font-medium">{assignment.title}</p>
                                                                        <p className="text-sm text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
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
                                                <p className="text-gray-500">No assignments available for this course.</p>
                                            )}
                                        </div>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardBody>
                                <h3 className="text-xl font-bold mb-4">Course Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-semibold">${course.price}</p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <p className="text-sm text-gray-500">Students Enrolled</p>
                                        <p className="font-semibold">{course.enrolled_students?.length || 0}</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
