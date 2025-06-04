import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardBody,
    Spinner,
    Button,
    Input,
    Textarea,
    Avatar,
    Divider
} from "@nextui-org/react";
import {
    TrashIcon,
} from '@heroicons/react/24/outline';
import { course as CourseApi } from "services";
import { useCourseDetails } from "../hooks/useCourseFetch";

const EditCourse = () => {
    const { id } = useParams();
    const { course, loading, error } = useCourseDetails("full");
    const [editing, setEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [newCoverImage, setNewCoverImage] = useState(null);
    const [newMaterial, setNewMaterial] = useState(null);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleDescription, setNewModuleDescription] = useState("");
    const [newContentTitle, setNewContentTitle] = useState({});
    const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
    const [newAssignmentDescription, setNewAssignmentDescription] = useState("");
    const [studentIdToEnroll, setStudentIdToEnroll] = useState("");

    // Set initial course data when course is fetched
    React.useEffect(() => {
        if (course) {
            setUpdatedTitle(course.title);
            setUpdatedDescription(course.description);
        }
    }, [course]);

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('title', updatedTitle);
            formData.append('description', updatedDescription);
            if (newCoverImage) formData.append('cover_image', newCoverImage);
            if (newMaterial) formData.append('material', newMaterial);
            await CourseApi.updateCourse(id, formData);
            setNewCoverImage(null);
            setNewMaterial(null);
            setEditing(false);
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        try {
            await CourseApi.deleteModuleContent(id, course.modules[0]?.id, materialId); // Assuming materials are under first module
        } catch (error) {
            console.error("Failed to delete material:", error);
        }
    };

    const handleAddModule = async () => {
        try {
            await CourseApi.createModule(id, { title: newModuleTitle, description: newModuleDescription });
            setNewModuleTitle("");
            setNewModuleDescription("");
        } catch (error) {
            console.error("Failed to add module:", error);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        try {
            await CourseApi.deleteModule(id, moduleId);
        } catch (error) {
            console.error("Failed to delete module:", error);
        }
    };

    const handleAddContent = async (moduleId) => {
        try {
            await CourseApi.addModuleContent(id, moduleId, { title: newContentTitle[moduleId] || "" });
            setNewContentTitle({ ...newContentTitle, [moduleId]: "" });
        } catch (error) {
            console.error("Failed to add content:", error);
        }
    };

    const handleDeleteContent = async (moduleId, contentId) => {
        try {
            await CourseApi.deleteModuleContent(id, moduleId, contentId);
        } catch (error) {
            console.error("Failed to delete content:", error);
        }
    };

    const handleAddAssignment = async () => {
        try {
            await CourseApi.createAssignment(id, { title: newAssignmentTitle, description: newAssignmentDescription });
            setNewAssignmentTitle("");
            setNewAssignmentDescription("");
        } catch (error) {
            console.error("Failed to add assignment:", error);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await CourseApi.deleteAssignment(id, assignmentId);
        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    const handleEnrollStudent = async () => {
        try {
            await CourseApi.enrollStudent(id, { student_id: studentIdToEnroll });
            setStudentIdToEnroll("");
        } catch (error) {
            console.error("Failed to enroll student:", error);
        }
    };

    const handleUnenrollStudent = async (studentId) => {
        try {
            await CourseApi.unenrollStudent(id, studentId);
        } catch (error) {
            console.error("Failed to unenroll student:", error);
        }
    };

    const handlePublishCourse = async () => {
        try {
            await CourseApi.publishCourse(id, !course.is_published);
        } catch (error) {
            console.error("Failed to update publish status:", error);
        }
    };

    if (loading) return <Spinner />;
    if (error || !course) return <p>{error || "Course not found"}</p>;

    return (
        <Card>
            <CardBody>
                {/* Course Info */}
                {editing ? (
                    <Input value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} placeholder="Title" />
                ) : (
                    <h1>{course.title}</h1>
                )}
                <Button onClick={editing ? saveChanges : () => setEditing(true)}>
                    {editing ? "Save" : "Edit"}
                </Button>
                <Divider />

                {/* Description */}
                {editing ? (
                    <Textarea
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        placeholder="Description"
                    />
                ) : (
                    <p>{course.description}</p>
                )}

                {/* Cover Image */}
                <h2>Cover</h2>
                {course.cover_image ? <Avatar src={course.cover_image} /> : <p>No Image</p>}
                {editing && (
                    <input type="file" onChange={(e) => setNewCoverImage(e.target.files[0])} />
                )}
                <Divider />

                {/* Students */}
                <h2>Students ({course.enrolled_students?.length || 0})</h2>
                {course.enrolled_students?.map((student) => (
                    <div key={student.id}>
                        {student.name}
                        {editing && (
                            <Button onClick={() => handleUnenrollStudent(student.id)}>
                                <TrashIcon />
                            </Button>
                        )}
                    </div>
                ))}
                {editing && (
                    <>
                        <Input
                            value={studentIdToEnroll}
                            onChange={(e) => setStudentIdToEnroll(e.target.value)}
                            placeholder="Student ID"
                        />
                        <Button onClick={handleEnrollStudent}>Enroll</Button>
                    </>
                )}
                <Divider />

                {/* Materials */}
                <h2>Materials ({course.materials?.length || 0})</h2>
                {editing && <input type="file" onChange={(e) => setNewMaterial(e.target.files[0])} />}
                {course.materials?.map((material) => (
                    <div key={material.id}>
                        {material.name}
                        {editing && (
                            <Button onClick={() => handleDeleteMaterial(material.id)}>
                                <TrashIcon />
                            </Button>
                        )}
                    </div>
                ))}
                <Divider />

                {/* Modules */}
                <h2>Modules</h2>
                {course.modules?.map((module) => (
                    <div key={module.id}>
                        <h3>{module.title}</h3>
                        <p>{module.description}</p>
                        {module.contents?.map((content) => (
                            <div key={content.id}>
                                {content.title}
                                {editing && (
                                    <Button onClick={() => handleDeleteContent(module.id, content.id)}>
                                        <TrashIcon />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {editing && (
                            <>
                                <Input
                                    value={newContentTitle[module.id] || ""}
                                    onChange={(e) =>
                                        setNewContentTitle({ ...newContentTitle, [module.id]: e.target.value })
                                    }
                                    placeholder="Content Title"
                                />
                                <Button onClick={() => handleAddContent(module.id)}>Add Content</Button>
                                <Button onClick={() => handleDeleteModule(module.id)}>
                                    <TrashIcon />
                                </Button>
                            </>
                        )}
                    </div>
                ))}
                {editing && (
                    <>
                        <Input
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            placeholder="Module Title"
                        />
                        <Textarea
                            value={newModuleDescription}
                            onChange={(e) => setNewModuleDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <Button onClick={handleAddModule}>Add Module</Button>
                    </>
                )}
                <Divider />

                {/* Assignments */}
                <h2>Assignments</h2>
                {course.assignments?.map((assignment) => (
                    <div key={assignment.id}>
                        {assignment.title} - {assignment.description}
                        {editing && (
                            <Button onClick={() => handleDeleteAssignment(assignment.id)}>
                                <TrashIcon />
                            </Button>
                        )}
                    </div>
                ))}
                {editing && (
                    <>
                        <Input
                            value={newAssignmentTitle}
                            onChange={(e) => setNewAssignmentTitle(e.target.value)}
                            placeholder="Assignment Title"
                        />
                        <Textarea
                            value={newAssignmentDescription}
                            onChange={(e) => setNewAssignmentDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <Button onClick={handleAddAssignment}>Add Assignment</Button>
                    </>
                )}
                <Divider />

                {/* Publish */}
                <h2>Settings</h2>
                <p>Published: {course.is_published ? "Yes" : "No"}</p>
                {editing && (
                    <Button onClick={handlePublishCourse}>
                        {course.is_published ? "Unpublish" : "Publish"}
                    </Button>
                )}
            </CardBody>
        </Card>
    );
};

export default EditCourse;