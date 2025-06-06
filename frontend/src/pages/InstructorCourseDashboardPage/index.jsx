import React, { useState, useEffect, useMemo } from "react";
import { Spinner, Button, Tabs, Tab } from "@nextui-org/react";
import { useParams } from "react-router-dom";

import { course as CourseApi } from "services";
import { assignment as assignmentApi } from "services";
import CourseHeader from "./components/CourseHeader";
import DashboardCards from "./components/DashboardCards";
import StudentsSection from "./sections/StudentsSection";
import ModulesSection from "./sections/ModulesSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import AddModuleModal from "./sections/AddModuleModal";
import AddAssignmentModal from "./sections/AddAssignmentModal";
import EnrollStudentModal from "./sections/EnrollStudentModal";
import SubmissionsModal from "./sections/SubmissionsModal";
import GradingModal from "./sections/GradingModal";
import { useCourseDetails } from "../../hooks/useCourseFetch";

const EditCourse = () => {
  const { id: courseId } = useParams();
  const { course, loading, error, refetchCourse } = useCourseDetails("full");

  // --- Local state ---
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Course basic info
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [newCoverImage, setNewCoverImage] = useState(null);

  // Module management
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");

  // Assignment management
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentDescription, setNewAssignmentDescription] = useState("");
  const [newAssignmentType, setNewAssignmentType] = useState("text");
  const [newAssignmentPoints, setNewAssignmentPoints] = useState("100");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");

  // Student management
  const [studentIdToEnroll, setStudentIdToEnroll] = useState("");

  // View/Grade Submissions
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Modals open/close
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isEnrollStudentOpen, setIsEnrollStudentOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

  // Populate “title/description” when course data arrives
  useEffect(() => {
    if (course) {
      setUpdatedTitle(course.title);
      setUpdatedDescription(course.description);
    }
  }, [course]);

  // Convert enrolled_students array → a map for quick lookups in SubmissionsModal
  const allStudentsMap = useMemo(() => {
    const map = {};
    if (course?.enrolled_students) {
      course.enrolled_students.forEach((stu) => {
        map[stu._id] = stu;
      });
    }
    return map;
  }, [course]);

  // Utility: show alerts on success or error
  const handleDataMutationSuccess = (message = "Operation successful!") => {
    if (refetchCourse) {
      refetchCourse();
    }
  };
  const handleError = (err, action = "perform action") => {
    const msg =
        err.response?.data?.error || err.message || "An unexpected error occurred.";
    alert(`Error performing ${action}: ${msg}`);
  };

  // Save course details (title/desc/cover)
  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updatedTitle);
      formData.append("description", updatedDescription);
      if (newCoverImage) formData.append("cover_image", newCoverImage);
      await CourseApi.updateCourse(courseId, formData);
      setNewCoverImage(null);
      setEditing(false);
      handleDataMutationSuccess("Course details updated.");
    } catch (err) {
      handleError(err, "save course changes");
    }
  };

  // Add a new module
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      alert("Module title cannot be empty.");
      return;
    }
    try {
      await CourseApi.createModule(courseId, {
        title: newModuleTitle,
        description: newModuleDescription,
      });
      setNewModuleTitle("");
      setNewModuleDescription("");
      setIsAddModuleOpen(false);
      handleDataMutationSuccess("Module added.");
    } catch (err) {
      handleError(err, "add module");
    }
  };

  // Delete a module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module and all its contents?")) return;
    try {
      await CourseApi.deleteModule(courseId, moduleId);
      handleDataMutationSuccess("Module deleted.");
    } catch (err) {
      handleError(err, "delete module");
    }
  };

  // Add a new assignment
  const handleAddAssignment = async () => {
    if (!newAssignmentTitle.trim()) {
      alert("Assignment title cannot be empty.");
      return;
    }
    try {
      const assignmentFormData = new FormData();
      assignmentFormData.append("title", newAssignmentTitle);
      assignmentFormData.append("description", newAssignmentDescription);
      assignmentFormData.append("assignment_type", newAssignmentType);
      assignmentFormData.append(
          "points",
          (parseInt(newAssignmentPoints) || 100).toString()
      );
      if (newAssignmentDueDate) {
        assignmentFormData.append(
            "due_date",
            new Date(newAssignmentDueDate).toISOString()
        );
      }
      await CourseApi.createAssignment(courseId, assignmentFormData);
      setNewAssignmentTitle("");
      setNewAssignmentDescription("");
      setNewAssignmentType("text");
      setNewAssignmentPoints("100");
      setNewAssignmentDueDate("");
      setIsAddAssignmentOpen(false);
      handleDataMutationSuccess("Assignment created.");
    } catch (err) {
      handleError(err, "add assignment");
    }
  };

  // Publish / unpublish an assignment
  const handlePublishAssignment = async (assignmentId, newIsPublishedState) => {
    try {
      await assignmentApi.publishAssignment(courseId, assignmentId, {
        is_published: newIsPublishedState,
      });
      handleDataMutationSuccess(
          `Assignment ${newIsPublishedState ? "published" : "unpublished"}.`
      );
    } catch (err) {
      handleError(err, "publish assignment");
    }
  };

  // Delete an assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Delete this assignment (and all its submissions)?")) return;
    try {
      await CourseApi.deleteAssignment(courseId, assignmentId);
      handleDataMutationSuccess("Assignment deleted.");
    } catch (err) {
      handleError(err, "delete assignment");
    }
  };

  // Enroll a student
  const handleEnrollStudent = async () => {
    if (!studentIdToEnroll.trim()) {
      alert("Student ID/Email cannot be empty");
      return;
    }
    try {
      await CourseApi.enrollStudent(courseId, { student_id: studentIdToEnroll });
      setStudentIdToEnroll("");
      setIsEnrollStudentOpen(false);
      handleDataMutationSuccess("Student enrolled.");
    } catch (err) {
      handleError(err, "enroll student");
    }
  };

  // Unenroll a student
  const handleUnenrollStudent = async (studentIdToUnenroll) => {
    if (!window.confirm("Are you sure you want to unenroll this student?")) return;
    try {
      await CourseApi.unenrollStudent(courseId, studentIdToUnenroll);
      handleDataMutationSuccess("Student unenrolled.");
    } catch (err) {
      handleError(err, "unenroll student");
    }
  };

  // Fetch submissions for a given assignment
  const handleViewSubmissions = async (assignment) => {
    if (!assignment) return;
    setViewingAssignment(assignment);
    setSubmissionsLoading(true);
    try {
      const submissionsData = await CourseApi.getAssignmentSubmissions(
          courseId,
          assignment._id
      );
      setAssignmentSubmissions(submissionsData || []);
      setIsSubmissionsModalOpen(true);
    } catch (err) {
      handleError(err, "fetch submissions");
      setAssignmentSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Open grading form with a chosen submission
  const openGradingForm = (submission) => {
    setCurrentGradingSubmission({
      submissionId: submission._id,
      studentId: submission.student_id,
      studentName: allStudentsMap[submission.student_id]?.name || submission.student_id,
    });
    setGradeInput(submission.grade != null ? String(submission.grade) : "");
    setFeedbackInput(submission.feedback || "");
    setIsGradingModalOpen(true);
  };

  // ←–– FIXED: now uses submissionId (not studentId)
  const handleGradeSubmission = async () => {
    if (!currentGradingSubmission || !viewingAssignment) return;
    const gradeValue = parseFloat(gradeInput);
    if (isNaN(gradeValue)) {
      alert("Grade must be a valid number.");
      return;
    }

    const gradeData = {
      grade: gradeValue,
      feedback: feedbackInput,
    };

    try {
      // Pass submissionId instead of studentId
      await assignmentApi.gradeWithFeedback(
          courseId,
          viewingAssignment._id,
          currentGradingSubmission.submissionId,
          gradeData.grade,
          gradeData.feedback
      );

      // Update local submissions list so UI refreshes immediately
      setAssignmentSubmissions((prev) =>
          prev.map((sub) => {
            if (sub._id === currentGradingSubmission.submissionId) {
              return {
                ...sub,
                grade: gradeData.grade,
                feedback: gradeData.feedback,
                status: "graded",
              };
            }
            return sub;
          })
      );

      setIsGradingModalOpen(false);
      handleDataMutationSuccess("Submission graded.");
    } catch (err) {
      handleError(err, "grade submission");
    }
  };

  // Compute simple submission stats for the dashboard
  const getSubmissionStats = () => {
    if (!course || !course.assignments) {
      return { totalAssignments: 0, submittedCount: 0, gradedCount: 0 };
    }
    let submittedCount = 0;
    let gradedCount = 0;
    course.assignments.forEach((assignment) => {
      const assignmentSubs = assignment.submissions || [];
      assignmentSubs.forEach((sub) => {
        if (sub.status === "submitted" || sub.status === "graded") {
          submittedCount++;
        }
        if (sub.status === "graded") {
          gradedCount++;
        }
      });
    });
    return {
      totalAssignments: course.assignments.length,
      submittedCount,
      gradedCount,
    };
  };

  // --- NEW: compute final_grade for each assignment (highest grade among its submissions)
  const assignmentsWithFinal = useMemo(() => {
    if (!course?.assignments) return [];
    return course.assignments.map((a) => {
      const grades = (a.submissions || [])
          .filter((s) => s.grade != null)
          .map((s) => parseFloat(s.grade));
      const finalGrade = grades.length ? Math.max(...grades) : null;
      return { ...a, final_grade: finalGrade };
    });
  }, [course]);

  // Render‐guard for loading / error / no-course
  if (loading && !course) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" label="Loading course details..." />
        </div>
    );
  }
  if (error) {
    return (
        <div className="text-center p-8">
          <p className="text-danger text-xl">
            {error?.message || "Failed to load course details."}
          </p>
          <Button onPress={() => refetchCourse && refetchCourse()}>Try Again</Button>
        </div>
    );
  }
  if (!course) {
    return (
        <div className="text-center p-8">
          <p className="text-xl">Course not found.</p>
        </div>
    );
  }

  const stats = getSubmissionStats();

  return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ====== COURSE HEADER ====== */}
        <CourseHeader
            course={course}
            editing={editing}
            updatedTitle={updatedTitle}
            updatedDescription={updatedDescription}
            newCoverImage={newCoverImage}
            setNewCoverImage={setNewCoverImage}
            setUpdatedTitle={setUpdatedTitle}
            setUpdatedDescription={setUpdatedDescription}
            onSave={saveChanges}
            onCancel={() => {
              setEditing(false);
              setUpdatedTitle(course.title);
              setUpdatedDescription(course.description);
              setNewCoverImage(null);
            }}
            onEdit={() => setEditing(true)}
            onPublish={() =>
                CourseApi.publishCourse(courseId, !course.is_published)
                    .then(handleDataMutationSuccess)
                    .catch((err) => handleError(err, "toggle publish"))
            }
        />

        {/* ====== DASHBOARD CARDS ====== */}
        <DashboardCards
            stats={{
              enrolledStudents: course.enrolled_students?.length || 0,
              modules: course.modules?.length || 0,
              assignments: stats.totalAssignments,
              totalSubmissions: stats.submittedCount,
            }}
        />

        {/* ====== TABS ====== */}
        <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            aria-label="Course Management Tabs"
            color="primary"
            variant="underlined"
            fullWidth
        >
          <Tab key="overview" title="Overview">
            <div className="p-4">
              {editing ? (
                  <textarea
                      className="w-full px-3 py-2 border rounded"
                      value={updatedDescription}
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                      placeholder="Course description…"
                      rows={5}
                  />
              ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {course.description || "No description available."}
                  </p>
              )}
            </div>
          </Tab>

          <Tab key="students" title="Students">
            <StudentsSection
                enrolledStudents={course.enrolled_students || []}
                onEnroll={() => setIsEnrollStudentOpen(true)}
                onUnenroll={handleUnenrollStudent}
            />
          </Tab>

          <Tab key="modules" title="Modules">
            <ModulesSection
                modules={course.modules || []}
                onAddModule={() => setIsAddModuleOpen(true)}
                onDeleteModule={handleDeleteModule}
            />
          </Tab>

          <Tab key="assignments" title="Assignments">
            <AssignmentsSection
                assignments={assignmentsWithFinal}
                onAddAssignment={() => setIsAddAssignmentOpen(true)}
                onPublishAssignment={handlePublishAssignment}
                onDeleteAssignment={handleDeleteAssignment}
                onViewSubmissions={handleViewSubmissions}
                submissionsLoading={submissionsLoading}
                viewingAssignmentId={viewingAssignment?._id}
            />
          </Tab>
        </Tabs>

        {/* ====== MODALS ====== */}
        <AddModuleModal
            isOpen={isAddModuleOpen}
            onClose={() => setIsAddModuleOpen(false)}
            newTitle={newModuleTitle}
            setNewTitle={setNewModuleTitle}
            newDesc={newModuleDescription}
            setNewDesc={setNewModuleDescription}
            onAdd={handleAddModule}
        />

        <AddAssignmentModal
            isOpen={isAddAssignmentOpen}
            onClose={() => setIsAddAssignmentOpen(false)}
            newTitle={newAssignmentTitle}
            setNewTitle={setNewAssignmentTitle}
            newDesc={newAssignmentDescription}
            setNewDesc={setNewAssignmentDescription}
            newType={newAssignmentType}
            setNewType={setNewAssignmentType}
            newPoints={newAssignmentPoints}
            setNewPoints={setNewAssignmentPoints}
            newDueDate={newAssignmentDueDate}
            setNewDueDate={setNewAssignmentDueDate}
            onAdd={handleAddAssignment}
        />

        <EnrollStudentModal
            isOpen={isEnrollStudentOpen}
            onClose={() => setIsEnrollStudentOpen(false)}
            studentId={studentIdToEnroll}
            setStudentId={setStudentIdToEnroll}
            onEnroll={handleEnrollStudent}
        />

        <SubmissionsModal
            isOpen={isSubmissionsModalOpen}
            onClose={() => setIsSubmissionsModalOpen(false)}
            submissions={assignmentSubmissions}
            loading={submissionsLoading}
            allStudentsMap={allStudentsMap}
            onGradeClick={openGradingForm}
        />

        <GradingModal
            isOpen={isGradingModalOpen}
            onClose={() => setIsGradingModalOpen(false)}
            studentName={currentGradingSubmission?.studentName}
            gradeInput={gradeInput}
            setGradeInput={setGradeInput}
            feedbackInput={feedbackInput}
            setFeedbackInput={setFeedbackInput}
            onSubmit={handleGradeSubmission}
        />
      </div>
  );
};

export default EditCourse;
