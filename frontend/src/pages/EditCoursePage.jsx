import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, Spinner, Button, Input, Textarea, Avatar, Divider } from "@nextui-org/react";
import { course as CourseApi } from "services";

const EditCourse = () => {
    const { id } = useParams(); // Get course ID from route
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
            const updatedData = { title: updatedTitle, description: updatedDescription };
            await CourseApi.updateCourse(id, updatedData);
            if (newCoverImage) {
                // Placeholder: API integration for updating the cover image
                console.log("New cover image to upload:", newCoverImage);
            }
            if (newMaterial) {
                // Placeholder: API integration for adding course materials
                console.log("New material to upload:", newMaterial);
            }
            fetchCourseData(); // Refresh the course data
            setEditing(false);
        } catch (error) {
            console.error("Failed to save changes:", error);
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
                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">
                                {editing ? (
                                    <Input
                                        value={updatedTitle}
                                        onChange={(e) => setUpdatedTitle(e.target.value)}
                                        className="w-full"
                                    />
                                ) : (
                                    course.title
                                )}
                            </h1>
                            <Button
                                color={editing ? "success" : "primary"}
                                onClick={editing ? saveChanges : () => setEditing(true)}
                            >
                                {editing ? "Save Changes" : "Edit Course"}
                            </Button>
                        </div>

                        <Divider className="my-6" />

                        {/* Course Description */}
                        <h2 className="text-lg font-semibold mb-4">Course Description</h2>
                        {editing ? (
                            <Textarea
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                                rows={4}
                                className="w-full"
                            />
                        ) : (
                            <p>{course.description}</p>
                        )}

                        <Divider className="my-6" />

                        {/* Course Cover Image */}
                        <h2 className="text-lg font-semibold mb-4">Course Cover Image</h2>
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={course.thumbnail_url || "https://via.placeholder.com/150"}
                                className="w-32 h-32"
                            />
                            {editing && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewCoverImage(e.target.files[0])}
                                />
                            )}
                        </div>

                        <Divider className="my-6" />

                        {/* Add Course Materials */}
                        <h2 className="text-lg font-semibold mb-4">Add Materials</h2>
                        <div>
                            <input
                                type="file"
                                accept="application/pdf,application/vnd.ms-excel,application/msword"
                                onChange={(e) => setNewMaterial(e.target.files[0])}
                            />
                            {newMaterial && <p>Selected file: {newMaterial.name}</p>}
                        </div>

                        <Divider className="my-6" />

                        {/* Enrolled Students */}
                        <h2 className="text-lg font-semibold mb-4">Enrolled Students</h2>
                        <p>{course.enrolled_students?.length || 0} students are enrolled in this course.</p>
                        <ul className="list-disc ml-5">
                            {course.enrolled_students?.map((student, index) => (
                                <li key={index}>{student.name || `Student ${index + 1}`}</li>
                            ))}
                        </ul>

                        <Divider className="my-6" />

                        {/* Assignments Management */}
                        <h2 className="text-lg font-semibold mb-4">Assignments</h2>
                        <ul className="list-disc ml-5">
                            {course.assignments?.map((assignment, index) => (
                                <li key={index}>
                                    <span>{assignment.title}</span>
                                    {editing && (
                                        <Button
                                            color="danger"
                                            size="sm"
                                            className="ml-4"
                                            onClick={() =>
                                                console.log(`Delete assignment ID: ${assignment.id}`)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {editing && (
                            <Button
                                color="primary"
                                size="sm"
                                className="mt-4"
                                onClick={() => console.log("Add new assignment")}
                            >
                                Add Assignment
                            </Button>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default EditCourse;
