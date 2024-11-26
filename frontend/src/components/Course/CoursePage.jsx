import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardBody,
    Chip,
    Avatar,
    Divider,
    Spinner,
    Button,
    Tab,
    Tabs,
    AvatarIcon,
} from "@nextui-org/react";
import {
    Tag,
    BookOpen,
    Download,
    FileText,
    BarChart2,
    GraduationCap
} from "lucide-react";
import { course as CourseApi } from "../../services";

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("overview");

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const courseData = await CourseApi.getDetailsById(id);
            if (!courseData) throw new Error("Course data not found");
            setCourse(courseData);
        } catch (error) {
            console.error("Failed to fetch course data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-6 pb-12">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Course Header with Cover Image */}
                <div className="relative mb-6">
                    <div className="w-full aspect-[16/6] bg-black rounded-xl overflow-hidden shadow-xl">
                        <img
                            alt={`Cover for ${course.title}`}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                            src={course.cover_image || "/AUPP-Main-Logo.svg"}
                            onError={(e) => {
                                e.target.src = "/AUPP-Main-Logo.svg";
                                e.target.classList.add("opacity-50");
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Instructor Card */}
                        <Card className="shadow-md">
                            <CardBody className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {course?.instructor?.profile_image ? (
                                        <Avatar
                                            src={course.instructor.profile_image}
                                            className="w-16 h-16 border-3 border-primary"
                                        />
                                    ) : (
                                        <Avatar
                                            icon={<AvatarIcon/>}
                                            classNames={{
                                                base: "w-16 h-16 bg-gradient-to-br from-primary-300 to-primary-600",
                                                icon: "text-white",
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p className="text-lg font-semibold">{`Professor ${course?.instructor?.name || "Instructor"}`}</p>
                                        <p className="text-sm text-gray-500">Course Instructor</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Tabs Container */}
                        <Card className="shadow-md">
                            <CardBody>
                                <Tabs
                                    selectedKey={selectedTab}
                                    onSelectionChange={setSelectedTab}
                                    color="primary"
                                    variant="underlined"
                                    className="mb-4"
                                >
                                    {/* Overview Tab */}
                                    <Tab
                                        key="overview"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <FileText size={18} />
                                                <span>Overview</span>
                                            </div>
                                        }
                                    >
                                        <div className="mt-4 space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">About This Course</h3>
                                                <p className="text-gray-600 leading-relaxed">{course.description}</p>
                                            </div>

                                            {/* Majors and Tags Section */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-3">Majors</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.majors?.length ? (
                                                            course.majors.map((major, index) => (
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
                                                        {course.tags?.length ? (
                                                            course.tags.map((tag, index) => (
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
                                    </Tab>

                                    {/* Assignments Tab */}
                                    <Tab
                                        key="assignments"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <BookOpen size={18} />
                                                <span>Assignments</span>
                                            </div>
                                        }
                                    >
                                        <div className="mt-4">
                                            {course.assignments?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {course.assignments.map((assignment, index) => (
                                                        <Card
                                                            key={index}
                                                            className="hover:shadow-md transition-shadow"
                                                        >
                                                            <CardBody className="flex flex-row items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <BookOpen size={20} className="text-primary" />
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {assignment.title}
                                                                        </p>
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
                                    </Tab>

                                    {/* Modules Tab (Placeholder) */}
                                    <Tab
                                        key="modules"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <GraduationCap size={18} />
                                                <span>Modules</span>
                                            </div>
                                        }
                                    >
                                        <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500 mb-4">Course modules will be displayed here.</p>
                                            <Button color="primary" variant="solid">
                                                View Modules
                                            </Button>
                                        </div>
                                    </Tab>

                                    {/* Grades Tab (Placeholder) */}
                                    <Tab
                                        key="grades"
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <BarChart2 size={18} />
                                                <span>Grades</span>
                                            </div>
                                        }
                                    >
                                        <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500 mb-4">Your grades will be displayed here.</p>
                                            <Button color="primary" variant="solid">
                                                View Grades
                                            </Button>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-md sticky top-6">
                            <CardBody>
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <GraduationCap size={24} className="mr-2 text-primary" />
                                    Course Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-semibold text-primary text-lg">${course.price}</p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <p className="text-sm text-gray-500">Students Enrolled</p>
                                        <p className="font-semibold">
                                            {course.enrolled_students?.length || 0} Students
                                        </p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <p className="text-sm text-gray-500">Created On</p>
                                        <p className="font-semibold">
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="font-semibold">
                                            {new Date(course.updated_at).toLocaleDateString()}
                                        </p>
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