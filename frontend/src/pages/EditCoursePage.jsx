import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardBody,
    Spinner,
    Button,
    Input,
    Textarea,
    Avatar,
    Chip,
    Divider,
    useDisclosure
} from "@nextui-org/react";
import {
    PencilIcon,
    DocumentIcon,
    TrashIcon,
    AcademicCapIcon,
    UserGroupIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { course as CourseApi } from "services";
import {UploadIcon} from "lucide-react";

const EditCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [newMaterial, setNewMaterial] = useState(null);
    const [newCoverImage, setNewCoverImage] = useState(null);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const courseData = await CourseApi.getCourseById(id);
            if (!courseData) throw new Error("Course data not found");

            setCourse(courseData);
            setUpdatedTitle(courseData.title);
            setUpdatedDescription(courseData.description);
        } catch (error) {
            console.error("Failed to fetch course data:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveChanges = async () => {
        try {
            const updatedData = {
                title: updatedTitle,
                description: updatedDescription
            };
            await CourseApi.updateCourse(id, updatedData);

            if (newCoverImage) {
                // Implement cover image upload logic
                console.log("New cover image to upload:", newCoverImage);
            }

            if (newMaterial) {
                console.log("New material to upload:", newMaterial);
            }

            fetchCourseData();
            setEditing(false);
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <Card className="w-full max-w-md p-6 text-center">
                    <p className="text-gray-600">Course not found or data unavailable.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="shadow-2xl border-none">
                    <CardBody className="space-y-8 p-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                {editing ? (
                                    <Input
                                        value={updatedTitle}
                                        onChange={(e) => setUpdatedTitle(e.target.value)}
                                        placeholder="Course Title"
                                        variant="bordered"
                                        className="w-full md:w-96"
                                        startContent={<PencilIcon className="w-5 h-5 text-default-400" />}
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {course.title}
                                    </h1>
                                )}
                            </div>

                            <Button
                                color={editing ? "success" : "primary"}
                                variant="solid"
                                onClick={editing ? saveChanges : () => setEditing(true)}
                                startContent={editing ? null : <PencilIcon className="w-5 h-5" />}
                                className="w-full md:w-auto"
                            >
                                {editing ? "Save Changes" : "Edit Course"}
                            </Button>
                        </div>

                        <Divider />

                        {/* Course Details Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Description */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <DocumentTextIcon className="w-6 h-6 mr-2 text-primary" />
                                        Description
                                    </h2>
                                    {editing ? (
                                        <Textarea
                                            value={updatedDescription}
                                            onChange={(e) => setUpdatedDescription(e.target.value)}
                                            variant="bordered"
                                            minRows={6}
                                            placeholder="Enter course description"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{course.description || 'No description available'}</p>
                                    )}
                                </div>

                                {/* Course Cover */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <AcademicCapIcon className="w-6 h-6 mr-2 text-primary" />
                                        Course Cover
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        {course.cover_image || course.thumbnail_url ? (
                                            <Avatar
                                                src={course.cover_image || course.thumbnail_url}
                                                className="w-48 h-48 rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-48 h-48 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 border border-dashed">
                                                No Image
                                            </div>
                                        )}

                                        {editing && (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="coverUpload"
                                                    className="hidden"
                                                    onChange={(e) => setNewCoverImage(e.target.files[0])}
                                                />
                                                <label htmlFor="coverUpload">
                                                    <Button
                                                        as="span"
                                                        color="primary"
                                                        variant="flat"
                                                        startContent={<UploadIcon className="w-5 h-5" />}
                                                        disabled={!course.cover_image && !course.thumbnail_url}
                                                    >
                                                        {course.cover_image || course.thumbnail_url
                                                            ? "Change Cover"
                                                            : "Add Cover"}
                                                    </Button>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Enrolled Students */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <UserGroupIcon className="w-6 h-6 mr-2 text-primary" />
                                        Enrolled Students
                                        <Chip
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            className="ml-2"
                                        >
                                            {course.enrolled_students?.length || 0}
                                        </Chip>
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {course.enrolled_students?.slice(0, 4).map((student, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg"
                                            >
                                                <Avatar
                                                    src={student.profile_image}
                                                    size="sm"
                                                    className="w-8 h-8"
                                                />
                                                <span className="text-sm truncate">{student.name}</span>
                                            </div>
                                        ))}
                                        {(course.enrolled_students?.length || 0) > 4 && (
                                            <Chip color="default" variant="flat">
                                                +{(course.enrolled_students?.length || 0) - 4} more
                                            </Chip>
                                        )}
                                    </div>
                                </div>

                                {/* Course Materials */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <DocumentIcon className="w-6 h-6 mr-2 text-primary" />
                                        Course Materials
                                        <Chip
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            className="ml-2"
                                        >
                                            {course.materials?.length || 0}
                                        </Chip>
                                    </h2>
                                    <div className="space-y-2">
                                        {editing && (
                                            <div className="mb-4">
                                                <input
                                                    type="file"
                                                    id="materialUpload"
                                                    className="hidden"
                                                    onChange={(e) => setNewMaterial(e.target.files[0])}
                                                />
                                                <label htmlFor="materialUpload">
                                                    <Button
                                                        as="span"
                                                        color="primary"
                                                        variant="flat"
                                                        startContent={<UploadIcon className="w-5 h-5" />}
                                                    >
                                                        Upload Material
                                                    </Button>
                                                </label>
                                            </div>
                                        )}
                                        {course.materials?.map((material, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <DocumentIcon className="w-6 h-6 text-primary" />
                                                    <span className="text-sm">{material.name}</span>
                                                </div>
                                                {editing && (
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
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

export default EditCourse;