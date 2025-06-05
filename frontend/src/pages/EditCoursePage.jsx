import React, { useState, useEffect } from "react";
import {
    Card, CardBody, CardHeader, Spinner, Button, Input, Textarea, Avatar,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
    Chip, Tabs, Tab, Switch, Select, SelectItem, Tooltip, Image, Link
} from "@nextui-org/react";
import {
    TrashIcon,
    PencilIcon,
    PlusIcon,
    EyeIcon,
    UsersIcon,
    DocumentTextIcon,
    BookOpenIcon,
    AcademicCapIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { course as CourseApi } from "services";
import { assignment as assignmentApi } from "services";
import { useCourseDetails } from "../hooks/useCourseFetch";
import { useParams } from "react-router-dom";
import {ExternalLinkIcon, UploadIcon} from "lucide-react";

const EditCourse = () => {
    const { id: courseId } = useParams();
    const { course, loading, error, refetchCourse } = useCourseDetails("full");

    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Course basic info
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [newCoverImage, setNewCoverImage] = useState(null); // File object

    // Module management
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleDescription, setNewModuleDescription] = useState("");

    // Assignment management
    const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
    const [newAssignmentDescription, setNewAssignmentDescription] = useState("");
    const [newAssignmentType, setNewAssignmentType] = useState("text"); // e.g., "text", "file_upload"
    const [newAssignmentPoints, setNewAssignmentPoints] = useState("100");
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");

    // Student management
    const [studentIdToEnroll, setStudentIdToEnroll] = useState("");

    // Course-level Material management
    const [newMaterialFile, setNewMaterialFile] = useState(null); // File object

    // View/Grade Submissions
    const [viewingAssignment, setViewingAssignment] = useState(null); // Stores the whole assignment object
    const [assignmentSubmissions, setAssignmentSubmissions] = useState([]); // Stores submissions for viewingAssignment
    const [currentGradingSubmission, setCurrentGradingSubmission] = useState(null); // { submissionId, studentId, studentName }
    const [gradeInput, setGradeInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [submissionsLoading, setSubmissionsLoading] = useState(false);


    // Modals
    const { isOpen: isModuleModalOpen, onOpen: onModuleModalOpen, onClose: onModuleModalClose, onOpenChange: onModuleModalOpenChange } = useDisclosure();
    const { isOpen: isAssignmentModalOpen, onOpen: onAssignmentModalOpen, onClose: onAssignmentModalClose, onOpenChange: onAssignmentModalOpenChange } = useDisclosure();
    const { isOpen: isStudentModalOpen, onOpen: onStudentModalOpen, onClose: onStudentModalClose, onOpenChange: onStudentModalOpenChange } = useDisclosure();
    const { isOpen: isMaterialModalOpen, onOpen: onMaterialModalOpen, onClose: onMaterialModalClose, onOpenChange: onMaterialModalOpenChange } = useDisclosure();
    const { isOpen: isSubmissionsModalOpen, onOpen: onSubmissionsModalOpen, onClose: onSubmissionsModalClose, onOpenChange: onSubmissionsModalOpenChange } = useDisclosure();
    const { isOpen: isGradingFormOpen, onOpen: onGradingFormOpen, onClose: onGradingFormClose, onOpenChange: onGradingFormOpenChange } = useDisclosure();


    useEffect(() => {
        if (course) {
            setUpdatedTitle(course.title);
            setUpdatedDescription(course.description);
        }
    }, [course]);

    const handleDataMutationSuccess = (message = "Operation successful!") => {
        console.log(message);
        if (refetchCourse) {
            refetchCourse();
        } else {
            console.warn("Data updated. Consider implementing a refetch mechanism in useCourseDetails or pass a refetch function.");
        }
    };

    const handleError = (err, action = "perform action") => {
        const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred.";
        console.error(`Failed to ${action}:`, errorMessage, err);
        alert(`Error performing ${action}: ${errorMessage}`);
    };

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('title', updatedTitle);
            formData.append('description', updatedDescription);
            if (newCoverImage) formData.append('cover_image', newCoverImage);

            await CourseApi.updateCourse(courseId, formData);
            setNewCoverImage(null); // Clear after upload attempt
            setEditing(false);
            handleDataMutationSuccess("Course details updated.");
        } catch (err) {
            handleError(err, "save course changes");
        }
    };

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) {
            alert("Module title cannot be empty.");
            return;
        }
        try {
            await CourseApi.createModule(courseId, { title: newModuleTitle, description: newModuleDescription });
            setNewModuleTitle("");
            setNewModuleDescription("");
            onModuleModalClose();
            handleDataMutationSuccess("Module added.");
        } catch (err) {
            handleError(err, "add module");
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm("Are you sure you want to delete this module and all its contents?")) return;
        try {
            await CourseApi.deleteModule(courseId, moduleId);
            handleDataMutationSuccess("Module deleted.");
        } catch (err) {
            handleError(err, "delete module");
        }
    };

    const handleDeleteModuleContent = async (moduleId, contentId) => {
        if (!window.confirm("Are you sure you want to delete this module content?")) return;
        try {
            await CourseApi.deleteModuleContent(courseId, moduleId, contentId);
            handleDataMutationSuccess("Module content deleted.");
        } catch (err) {
            handleError(err, "delete module content");
        }
    };

    const handleAddAssignment = async () => {
        if (!newAssignmentTitle.trim()) {
            alert("Assignment title cannot be empty.");
            return;
        }
        try {
            const assignmentFormData = new FormData();
            assignmentFormData.append('title', newAssignmentTitle);
            assignmentFormData.append('description', newAssignmentDescription);
            assignmentFormData.append('assignment_type', newAssignmentType);
            assignmentFormData.append('points', (parseInt(newAssignmentPoints) || 100).toString());
            if (newAssignmentDueDate) {
                assignmentFormData.append('due_date', new Date(newAssignmentDueDate).toISOString());
            }
            await CourseApi.createAssignment(courseId, assignmentFormData);
            setNewAssignmentTitle(""); setNewAssignmentDescription(""); setNewAssignmentType("text");
            setNewAssignmentPoints("100"); setNewAssignmentDueDate("");
            onAssignmentModalClose();
            handleDataMutationSuccess("Assignment created.");
        } catch (err) {
            handleError(err, "add assignment");
        }
    };

    const handlePublishAssignment = async (assignmentId, newIsPublishedState) => {
        try {
            await assignmentApi.publishAssignment(courseId, assignmentId, { is_published: newIsPublishedState });
            handleDataMutationSuccess(`Assignment ${newIsPublishedState ? 'published' : 'unpublished'}.`);
        } catch (err) {
            handleError(err, "publish assignment");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm("Are you sure you want to delete this assignment? This will also delete all submissions.")) return;
        try {
            await CourseApi.deleteAssignment(courseId, assignmentId);
            handleDataMutationSuccess("Assignment deleted.");
        } catch (err) {
            handleError(err, "delete assignment");
        }
    };

    const handleEnrollStudent = async () => {
        if (!studentIdToEnroll.trim()) {
            alert("Student ID/Email cannot be empty");
            return;
        }
        try {
            await CourseApi.enrollStudent(courseId, { student_id: studentIdToEnroll });
            setStudentIdToEnroll("");
            onStudentModalClose();
            handleDataMutationSuccess("Student enrolled.");
        } catch (err) {
            handleError(err, "enroll student");
        }
    };

    const handleUnenrollStudent = async (studentIdToUnenroll) => {
         if (!window.confirm("Are you sure you want to unenroll this student?")) return;
        try {
            await CourseApi.unenrollStudent(courseId, studentIdToUnenroll);
            handleDataMutationSuccess("Student unenrolled.");
        } catch (err) {
            handleError(err, "unenroll student");
        }
    };

    const handleAddCourseMaterial = async () => {
        if (!newMaterialFile) {
            alert("No material file selected");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('material_file', newMaterialFile);
            formData.append('name', newMaterialFile.name);

            await CourseApi.uploadCourseMaterial(courseId, formData);

            setNewMaterialFile(null);
            onMaterialModalClose();
            handleDataMutationSuccess("Course material uploaded.");
        } catch (err) {
            handleError(err, "upload course material");
        }
    };

    const handleDeleteCourseMaterial = async (materialId) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;
        try {
            await CourseApi.deleteCourseMaterial(courseId, materialId);
            handleDataMutationSuccess("Course material deleted.");
        } catch (err)
        {
            handleError(err, "delete course material");
        }
    };

    const handlePublishCourse = async () => {
        try {
            await CourseApi.publishCourse(courseId, !course.is_published);
            handleDataMutationSuccess(`Course ${!course.is_published ? 'published' : 'unpublished'}.`);
        } catch (err) {
            handleError(err, "publish course");
        }
    };

    const handleViewSubmissions = async (assignment) => {
        if (!assignment) return;
        setSubmissionsLoading(true);
        setViewingAssignment(assignment); // Set which assignment we are viewing
        try {
            const submissionsData = await CourseApi.getAssignmentSubmissions(courseId, assignment.id || assignment._id);
            setAssignmentSubmissions(submissionsData || []);
            onSubmissionsModalOpen();
        } catch (err) {
            handleError(err, "fetch submissions");
            setAssignmentSubmissions([]);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const openGradingForm = (submission) => {
        setCurrentGradingSubmission({
            submissionId: submission.id || submission._id,
            studentId: submission.student?.id || submission.student?._id || submission.user_id,
            studentName: submission.student?.name || submission.student?.username || submission.user_id || "N/A",
        });
        setGradeInput(submission.grade !== null && submission.grade !== undefined ? String(submission.grade) : "");
        setFeedbackInput(submission.feedback || "");
        onGradingFormOpen();
    };

    const handleGradeSubmission = async () => {
        if (!currentGradingSubmission || !viewingAssignment) return;
        try {
            const gradeData = {
                grade: parseFloat(gradeInput),
                feedback: feedbackInput
            };
            if (isNaN(gradeData.grade)) {
                alert("Grade must be a valid number.");
                return;
            }
            console.log(currentGradingSubmission, "sir yes sir")

            await assignmentApi.gradeSubmission(
                courseId,
                viewingAssignment.id || viewingAssignment._id,
                currentGradingSubmission.studentId,
                gradeData
            );

            // Optimistically update local state for the submissions modal
             const updatedSubmissions = assignmentSubmissions.map(sub => {
                if ((sub.id || sub._id) === currentGradingSubmission.submissionId) {
                    return { ...sub, grade: gradeData.grade, feedback: gradeData.feedback, status: 'graded' };
                }
                return sub;
            });
            setAssignmentSubmissions(updatedSubmissions);

            onGradingFormClose();
            // Also trigger a full course refetch if grades might affect overall course stats displayed elsewhere
            handleDataMutationSuccess("Submission graded.");
        } catch (err) {
            handleError(err, "grade submission");
        }
    };


    const getSubmissionStats = () => {
        if (!course || !course.assignments) return { totalAssignments: 0, submittedCount: 0, gradedCount: 0 };
        let submittedCount = 0;
        let gradedCount = 0;
        course.assignments.forEach(assignment => {
            // Use the submissions array directly from the assignment object in the mock
            const assignmentSpecificSubmissions = assignment.submissions || [];
            assignmentSpecificSubmissions.forEach(sub => {
                 if (sub.status === 'submitted' || sub.status === 'graded') {
                    submittedCount++;
                }
                if (sub.status === 'graded') {
                    gradedCount++;
                }
            });
        });
        return { totalAssignments: course.assignments.length, submittedCount, gradedCount };
    };


    if (loading && !course) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" label="Loading course details..." /></div>;
    if (error) return <div className="text-center p-8"><p className="text-danger text-xl">{error?.message || "Failed to load course details."}</p><Button onPress={() => refetchCourse && refetchCourse()}>Try Again</Button></div>;
    if (!course) return <div className="text-center p-8"><p className="text-xl">Course not found.</p></div>;

    const stats = getSubmissionStats();

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
                <CardBody className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center space-x-4">
                            {editing ? (
                                <div className="w-24 h-24 bg-white/20 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                                    <label htmlFor="cover-image-upload" className="cursor-pointer text-xs mb-1 hover:text-blue-200">
                                        <UploadIcon className="w-6 h-6 mx-auto mb-1"/> Change Cover
                                    </label>
                                    <input
                                        id="cover-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewCoverImage(e.target.files[0])}
                                        className="hidden"
                                    />
                                     {newCoverImage && <span className="text-xs mt-1 truncate w-full block">{newCoverImage.name}</span>}
                                     {!newCoverImage && course.cover_image && <Image src={course.cover_image} alt="Current Cover" className="w-10 h-10 mt-1 rounded object-cover mx-auto"/>}
                                     {!newCoverImage && !course.cover_image && <BookOpenIcon className="w-8 h-8 mt-1 mx-auto" />}
                                </div>
                            ) : course.cover_image ? (
                                <Image src={course.cover_image} alt="Course cover" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-md" />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-xl flex items-center justify-center shadow-md">
                                    <BookOpenIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                                </div>
                            )}
                            <div>
                                {editing ? (
                                    <Input
                                        value={updatedTitle}
                                        onChange={(e) => setUpdatedTitle(e.target.value)}
                                        classNames={{ inputWrapper: "bg-transparent", input: "text-white placeholder:text-gray-300 text-2xl sm:text-3xl font-bold" }}
                                        variant="underlined"
                                        placeholder="Course Title"
                                    />
                                ) : (
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{course.title}</h1>
                                )}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                                    <Chip color={course.is_published ? "success" : "warning"} variant="flat" size="sm" startContent={course.is_published ? <CheckCircleIcon className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />}>
                                        {course.is_published ? "Published" : "Draft"}
                                    </Chip>
                                    <div className="flex items-center space-x-1 text-sm"> <UsersIcon className="w-4 h-4" /> <span>{course.enrolled_students?.length || 0} Students</span> </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <Button color={editing ? "success" : "secondary"} variant="flat" onClick={editing ? saveChanges : () => setEditing(true)} startContent={editing ? <CheckCircleIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />} className="w-full sm:w-auto">
                                {editing ? "Save Changes" : "Edit Details"}
                            </Button>
                            {editing && (
                                <Button color="default" variant="light" onClick={() => { setEditing(false); setUpdatedTitle(course.title); setUpdatedDescription(course.description); setNewCoverImage(null);}} className="w-full sm:w-auto"> Cancel </Button>
                            )}
                            <Button color={course.is_published ? "warning" : "success"} variant="solid" onClick={handlePublishCourse} className="w-full sm:w-auto">
                                {course.is_published ? "Unpublish" : "Publish Course"}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardBody className="p-4 text-center"><UsersIcon className="w-8 h-8 mx-auto mb-2 text-blue-500"/><p className="text-xs text-gray-500">Students</p><p className="text-xl font-bold">{course.enrolled_students?.length || 0}</p></CardBody></Card>
                <Card><CardBody className="p-4 text-center"><BookOpenIcon className="w-8 h-8 mx-auto mb-2 text-green-500"/><p className="text-xs text-gray-500">Modules</p><p className="text-xl font-bold">{course.modules?.length || 0}</p></CardBody></Card>
                <Card><CardBody className="p-4 text-center"><AcademicCapIcon className="w-8 h-8 mx-auto mb-2 text-purple-500"/><p className="text-xs text-gray-500">Assignments</p><p className="text-xl font-bold">{stats.totalAssignments || 0}</p></CardBody></Card>
                <Card><CardBody className="p-4 text-center"><ChartBarIcon className="w-8 h-8 mx-auto mb-2 text-orange-500"/><p className="text-xs text-gray-500">Total Submissions</p><p className="text-xl font-bold">{stats.submittedCount}</p></CardBody></Card>
            </div>

            <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab} aria-label="Course Management Tabs" color="primary" variant="underlined" fullWidth>
                <Tab key="overview" title="Overview">
                    <Card><CardHeader><h3 className="text-lg font-semibold">Course Description</h3></CardHeader>
                        <CardBody>
                            {editing ? (
                                <Textarea value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} placeholder="Course description..." minRows={5} />
                            ) : ( <p className="text-gray-700 whitespace-pre-wrap">{course.description || "No description available."}</p> )}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab key="students" title="Students">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Enrolled Students ({course.enrolled_students?.length || 0})</h3>
                            <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onStudentModalOpen}>Enroll Student</Button>
                        </CardHeader>
                        <CardBody>
                            {course.enrolled_students?.length > 0 ? (
                                <div className="space-y-3">
                                    {course.enrolled_students.map((student) => (
                                        <div key={student.id || student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <Avatar src={student.avatar_url || student.avatar} name={student.name || student.username} size="md" />
                                                <div>
                                                    <p className="font-medium">{student.name || student.username}</p>
                                                    <p className="text-sm text-gray-600">{student.email}</p>
                                                </div>
                                            </div>
                                            <Tooltip content="Unenroll Student" color="danger">
                                                <Button color="danger" variant="light" size="sm" isIconOnly onPress={() => handleUnenrollStudent(student.id || student._id)}>
                                                    <TrashIcon className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            ) : (<p className="text-center text-gray-500 py-8">No students enrolled yet.</p>)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab key="modules" title="Modules">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Course Modules ({course.modules?.length || 0})</h3>
                            <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onModuleModalOpen}>Add Module</Button>
                        </CardHeader>
                        <CardBody>
                            {course.modules?.length > 0 ? (
                                <div className="space-y-4">
                                    {course.modules.map((module, index) => (
                                        <Card key={module.id || module._id} className="border shadow-sm">
                                            <CardHeader className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg">Module {index + 1}: {module.title}</h4>
                                                    <p className="text-gray-600 text-sm">{module.description}</p>
                                                </div>
                                                <Tooltip content="Delete Module" color="danger">
                                                    <Button color="danger" variant="light" size="sm" isIconOnly onPress={() => handleDeleteModule(module.id || module._id)}>
                                                        <TrashIcon className="w-5 h-5" />
                                                    </Button>
                                                </Tooltip>
                                            </CardHeader>
                                            {module.contents && module.contents.length > 0 && (
                                                <CardBody className="pt-0">
                                                    <h5 className="font-medium text-sm text-gray-700 mb-2">Contents:</h5>
                                                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                                                        {module.contents.map((content) => (
                                                            <div key={content.id || content._id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100">
                                                                <div className="flex items-center space-x-2">
                                                                    <DocumentTextIcon className="w-4 h-4 text-gray-500"/>
                                                                    <span className="text-sm">{content.title} ({content.content_type})</span>
                                                                </div>
                                                                <Tooltip content="Delete Content" color="danger">
                                                                    <Button color="danger" variant="light" size="sm" isIconOnly onPress={() => handleDeleteModuleContent(module.id || module._id, content.id || content._id)}>
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </Button>
                                                                </Tooltip>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardBody>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            ) : (<p className="text-center text-gray-500 py-8">No modules created yet.</p>)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab key="assignments" title="Assignments">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Course Assignments ({course.assignments?.length || 0})</h3>
                            <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onAssignmentModalOpen}>Create Assignment</Button>
                        </CardHeader>
                        <CardBody>
                            {course.assignments?.length > 0 ? (
                                <div className="space-y-4">
                                    {course.assignments.map((assignment) => (
                                        <Card key={assignment.id || assignment._id} className="border shadow-sm">
                                            <CardBody>
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h4 className="font-semibold text-md">{assignment.title}</h4>
                                                            <Chip size="sm" color={assignment.is_published ? "success" : "warning"} variant="flat">
                                                                {assignment.is_published ? "Published" : "Draft"}
                                                            </Chip>
                                                        </div>
                                                        <p className="text-gray-600 mb-2 text-sm whitespace-pre-wrap">{assignment.description}</p>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                            <span>Points: {assignment.points || 100}</span>
                                                            {assignment.due_date && (
                                                                <span className="flex items-center space-x-1">
                                                                <CalendarIcon className="w-3 h-3" />
                                                                <span>Due: {new Date(assignment.due_date).toLocaleDateString()} {new Date(assignment.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </span>
                                                            )}
                                                            <span>Type: <Chip size="sm" variant="bordered" className="capitalize">{assignment.assignment_type?.replace("_", " ")}</Chip></span>
                                                            <span>Submissions: {assignment.submissions?.length || 0}</span> {/* This might need to be calculated from getAssignmentSubmissions if not directly on assignment object */}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                                                        <Tooltip content={assignment.is_published ? "Unpublish" : "Publish"}>
                                                            <Switch isSelected={!!assignment.is_published} onValueChange={(isSelected) => handlePublishAssignment(assignment.id || assignment._id, isSelected)} size="sm"/>
                                                        </Tooltip>
                                                        <Tooltip content="View Submissions">
                                                            <Button isLoading={submissionsLoading && viewingAssignment?.id === (assignment.id || assignment._id)} color="default" variant="light" size="sm" isIconOnly onPress={() => handleViewSubmissions(assignment)}> <EyeIcon className="w-5 h-5" /> </Button>
                                                        </Tooltip>
                                                        <Tooltip content="Delete Assignment" color="danger">
                                                            <Button color="danger" variant="light" size="sm" isIconOnly onPress={() => handleDeleteAssignment(assignment.id || assignment._id)}> <TrashIcon className="w-5 h-5" /> </Button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            ) : (<p className="text-center text-gray-500 py-8">No assignments created yet.</p>)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab key="materials" title="Course Materials">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Course-Specific Materials ({course.materials?.length || 0})</h3>
                            <Button color="primary" startContent={<UploadIcon className="w-4 h-4" />} onPress={onMaterialModalOpen}>Upload Material</Button>
                        </CardHeader>
                        <CardBody>
                            {course.materials?.length > 0 ? (
                                <div className="space-y-3">
                                    {course.materials.map((material) => (
                                        <div key={material.id || material._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <DocumentTextIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                                <div className="flex-grow min-w-0">
                                                    <p className="font-medium truncate" title={material.name || material.filename}>{material.name || material.filename}</p>
                                                    <p className="text-xs text-gray-500">{material.file_type || "Unknown type"} {material.size ? `(${(material.size / 1024).toFixed(1)} KB)` : ''}</p>
                                                    {material.url && (
                                                        <Link href={material.url} isExternal size="sm" className="text-xs items-center">
                                                            View/Download <ExternalLinkIcon className="w-3 h-3 ml-1"/>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            <Tooltip content="Delete Material" color="danger">
                                                <Button color="danger" variant="light" size="sm" isIconOnly onPress={() => handleDeleteCourseMaterial(material.id || material._id)}>
                                                    <TrashIcon className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            ) : (<p className="text-center text-gray-500 py-8">No course-specific materials uploaded yet.</p>)}
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>

            {/* --- Modals --- */}
            <Modal isOpen={isModuleModalOpen} onOpenChange={onModuleModalOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (<>
                        <ModalHeader className="flex flex-col gap-1">Add New Module</ModalHeader>
                        <ModalBody>
                            <Input autoFocus label="Module Title" value={newModuleTitle} onValueChange={setNewModuleTitle} placeholder="Enter module title" variant="bordered"/>
                            <Textarea label="Module Description" value={newModuleDescription} onValueChange={setNewModuleDescription} placeholder="Enter module description" variant="bordered"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                            <Button color="primary" onPress={() => { handleAddModule(); onClose(); }}>Add Module</Button>
                        </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

            <Modal isOpen={isAssignmentModalOpen} onOpenChange={onAssignmentModalOpenChange} placement="top-center" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (<>
                        <ModalHeader className="flex flex-col gap-1">Create New Assignment</ModalHeader>
                        <ModalBody>
                            <Input autoFocus label="Assignment Title" value={newAssignmentTitle} onValueChange={setNewAssignmentTitle} placeholder="Enter assignment title" variant="bordered"/>
                            <Textarea label="Assignment Description" value={newAssignmentDescription} onValueChange={setNewAssignmentDescription} placeholder="Enter assignment description" variant="bordered"/>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select label="Assignment Type" selectedKeys={new Set([newAssignmentType])} onSelectionChange={(keys) => setNewAssignmentType(Array.from(keys)[0])} placeholder="Select type" variant="bordered" className="flex-1">
                                    <SelectItem key="text" value="text">Text Response</SelectItem>
                                    <SelectItem key="file_upload" value="file_upload">File Upload</SelectItem>
                                    <SelectItem key="quiz" value="quiz">Quiz (External/Link)</SelectItem>
                                    <SelectItem key="project" value="project">Project</SelectItem>
                                </Select>
                                <Input label="Points" type="number" value={newAssignmentPoints} onValueChange={setNewAssignmentPoints} placeholder="100" variant="bordered" className="w-full sm:w-1/3"/>
                            </div>
                            <Input label="Due Date (Optional)" type="datetime-local" value={newAssignmentDueDate} onValueChange={setNewAssignmentDueDate} variant="bordered"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                            <Button color="primary" onPress={() => { handleAddAssignment(); onClose(); }}>Create Assignment</Button>
                        </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

             <Modal isOpen={isStudentModalOpen} onOpenChange={onStudentModalOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (<>
                        <ModalHeader className="flex flex-col gap-1">Enroll Student</ModalHeader>
                        <ModalBody>
                            <Input autoFocus label="Student ID or Email" value={studentIdToEnroll} onValueChange={setStudentIdToEnroll} placeholder="Enter student ID or email" variant="bordered"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                            <Button color="primary" onPress={() => { handleEnrollStudent(); onClose();}}>Enroll Student</Button>
                        </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

            <Modal isOpen={isMaterialModalOpen} onOpenChange={onMaterialModalOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (<>
                        <ModalHeader className="flex flex-col gap-1">Upload Course Material</ModalHeader>
                        <ModalBody>
                            <label htmlFor="material-file-upload" className="block w-full cursor-pointer p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500">
                                <UploadIcon className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
                                <span className="text-sm text-gray-600">Click to select file or drag and drop</span>
                                <input id="material-file-upload" type="file" onChange={(e) => setNewMaterialFile(e.target.files[0])} className="hidden"/>
                            </label>
                            {newMaterialFile && (<p className="text-sm text-green-600 mt-2">Selected: {newMaterialFile.name} ({(newMaterialFile.size / 1024).toFixed(1)} KB)</p>)}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => { setNewMaterialFile(null); onClose();}}>Cancel</Button>
                            <Button color="primary" onPress={() => { handleAddCourseMaterial(); onClose(); }} disabled={!newMaterialFile}>Upload Material</Button>
                        </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

            <Modal isOpen={isSubmissionsModalOpen} onOpenChange={onSubmissionsModalOpenChange} size="3xl" scrollBehavior="inside" placement="top-center">
                <ModalContent>
                    {(onCloseModal) => (<>
                        <ModalHeader className="flex flex-col gap-1">Submissions for: {viewingAssignment?.title}</ModalHeader>
                        <ModalBody>
                            {submissionsLoading && <div className="flex justify-center py-4"><Spinner label="Loading submissions..."/></div>}
                            {!submissionsLoading && assignmentSubmissions.length > 0 ? (
                                <ul className="space-y-3">
                                    {assignmentSubmissions.map((sub) => (
                                        <li key={sub.id || sub._id} className="p-4 border rounded-lg shadow-sm bg-white">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Avatar size="sm" name={sub.student?.name || sub.student?.username} src={sub.student?.avatar_url}/>
                                                        <p className="font-semibold text-md">
                                                            Student: {sub.student?.name || sub.student?.username || sub.user_id}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Submitted: {new Date(sub.submission_date || sub.created_at).toLocaleString()}</p>

                                                    {sub.content && <p className="text-sm mt-2 bg-gray-50 p-2 rounded whitespace-pre-wrap"><strong>Response:</strong><br/>{sub.content}</p>}

                                                    {sub.files && sub.files.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium">Files Submitted:</p>
                                                            <ul className="list-none pl-0 space-y-1 mt-1">
                                                                {sub.files.map((file, idx) => (
                                                                    <li key={idx} className="text-sm flex items-center">
                                                                        <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0"/>
                                                                        <Link href={file.url} isExternal className="text-primary-600 hover:underline truncate" title={file.filename || file.name}>
                                                                            {file.filename || file.name || `File ${idx + 1}`}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div className="mt-3 pt-2 border-t">
                                                        <p className="text-sm"><strong>Grade:</strong> {sub.grade !== null && sub.grade !== undefined ? sub.grade : <Chip size="sm" color="warning" variant="flat">Not Graded</Chip>}</p>
                                                        <p className="text-sm mt-1"><strong>Feedback:</strong> {sub.feedback || <span className="text-gray-500 italic">No feedback yet</span>}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" color="secondary" variant="flat" onPress={() => openGradingForm(sub)} className="mt-2 sm:mt-0">
                                                    {sub.grade !== null && sub.grade !== undefined ? "Edit Grade" : "Grade Submission"}
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : ( <p className="text-center py-8 text-gray-500">{submissionsLoading ? '...' : 'No submissions yet for this assignment.'}</p> )}
                        </ModalBody>
                        <ModalFooter> <Button color="danger" variant="light" onPress={onCloseModal}>Close</Button> </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

            <Modal isOpen={isGradingFormOpen} onOpenChange={onGradingFormOpenChange} placement="top-center">
                <ModalContent>
                    {(onCloseGrading) => (<>
                        <ModalHeader className="flex flex-col gap-1">Grade Submission: {currentGradingSubmission?.studentName}</ModalHeader>
                        <ModalBody>
                            <Input label="Grade" type="number" placeholder="Enter grade (e.g., 85)" value={gradeInput} onValueChange={setGradeInput} autoFocus variant="bordered"/>
                            <Textarea label="Feedback" placeholder="Provide feedback to the student" value={feedbackInput} onValueChange={setFeedbackInput} minRows={4} variant="bordered"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onCloseGrading}>Cancel</Button>
                            <Button color="primary" onPress={() => { handleGradeSubmission(); /* onCloseGrading(); */ }}>Submit Grade</Button>
                        </ModalFooter>
                    </>)}
                </ModalContent>
            </Modal>

        </div>
    );
};

export default EditCourse;
