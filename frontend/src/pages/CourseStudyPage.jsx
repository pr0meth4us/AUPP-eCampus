import React, { useState } from 'react';
import {
    BookOpen,
    Users,
    User,
    File,
    Clock,
    Tag,
    Clipboard,
    Download,
    ExternalLink,
    Star
} from 'lucide-react';
import { useCourseDetails } from "../hooks/useCourseFetch";
import {
    Spinner,
    Button,
    Chip,
    Tooltip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

// Utility Functions
const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return 'Invalid Date';
    }
};

const getDaysUntilDue = (dateString) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    return `${diffDays} days left`;
};

const CourseStudyPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const { course: courseData, loading, error } = useCourseDetails();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <p>Error loading course details: {error.message}</p>
            </div>
        );
    }

    const renderOverviewSection = () => (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3">Course Description</h2>
                <p className="text-gray-600">
                    {courseData.course.description || 'No description available'}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3">Course Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        {
                            icon: Tag,
                            label: 'Tags',
                            value: courseData.course.tag_names?.join(', ') || 'N/A'
                        },
                        {
                            icon: BookOpen,
                            label: 'Major',
                            value: courseData.course.major_names?.join(', ') || 'N/A'
                        },
                        {
                            icon: Clock,
                            label: 'Price',
                            value: courseData.course.price === '0' ? 'Free' : `$${courseData.course.price}`
                        },
                        {
                            icon: Users,
                            label: 'Students',
                            value: courseData.course.student_count || 0
                        }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center">
                            <item.icon className="mr-2 text-blue-500" />
                            <span>{item.label}: {item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderModulesSection = () => (
        <div className="space-y-4">
            {courseData.modules.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">No modules available</p>
                </div>
            ) : (
                courseData.modules.map((module) => (
                    <div
                        key={module._id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                                {module.title || 'Untitled Module'}
                            </h3>
                            {module.materials?.length > 0 && (
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                >
                                    {module.materials.length} Materials
                                </Chip>
                            )}
                        </div>
                        <p className="text-gray-500 mb-2">
                            {module.description || 'No description available'}
                        </p>
                        <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            startContent={<ExternalLink size={16} />}
                            onClick={() => navigate(`/courses/${courseData.course._id}/modules/${module._id}`)}
                        >
                            View Module Details
                        </Button>
                    </div>
                ))
            )}
        </div>
    );

    const renderAssignmentsSection = () => (
        <div className="space-y-4">
            {courseData.assignments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Clipboard className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">No assignments available</p>
                </div>
            ) : (
                courseData.assignments.map((assignment) => (
                    <div
                        key={assignment._id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={
                                    getDaysUntilDue(assignment.due_date) === 'Overdue'
                                        ? 'danger'
                                        : 'success'
                                }
                            >
                                {getDaysUntilDue(assignment.due_date)}
                            </Chip>
                        </div>
                        <p className="text-gray-600 mb-2">{assignment.description}</p>
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Due Date: {formatDate(assignment.due_date)}</p>
                                <p>Max Grade: {assignment.max_grade}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {assignment.file && (
                                    <Tooltip content="Download Assignment">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            startContent={<Download size={16} />}
                                            onClick={() => window.open(assignment.file, '_blank')}
                                        >
                                            Download
                                        </Button>
                                    </Tooltip>
                                )}
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    startContent={<ExternalLink size={16} />}
                                    onClick={() => navigate(`/courses/${courseData.course._id}/assignments/${assignment._id}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                        {assignment.submissions && (
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Submissions: {assignment.submissions.length}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    const renderPeopleSection = () => (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <User className="mr-2 text-blue-500" />
                    Instructor
                </h2>
                <div className="flex items-center">
                    <div className="mr-4">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {courseData.people.instructor.name || 'No Instructor'}
                        </h3>
                        <p className="text-gray-500 text-sm">Course Instructor</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                    <Users className="mr-2 text-blue-500" />
                    Students
                </h2>
                <div className="space-y-2">
                    {courseData.people.students.length === 0 ? (
                        <p className="text-gray-500">No students enrolled</p>
                    ) : (
                        courseData.people.students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                                    <User className="text-gray-500" />
                                </div>
                                <span>{student.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    const renderGradesSection = () => {
        const currentUser = courseData.people.students.find(s => s.name === 'test');

        return (
            <div className="space-y-4">
                {courseData.assignments.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Star className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600">No grades available</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <Star className="mr-2 text-blue-500" />
                            Course Grades
                        </h2>
                        <Table aria-label="Grades Table">
                            <TableHeader>
                                <TableColumn>Assignment</TableColumn>
                                <TableColumn>Due Date</TableColumn>
                                <TableColumn>Max Grade</TableColumn>
                                <TableColumn>Your Grade</TableColumn>
                                <TableColumn>Status</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {courseData.assignments.map((assignment) => {
                                    const userSubmission = assignment.submissionsData.find(
                                        submission => submission.student_id === currentUser?.id
                                    );

                                    return (
                                        <TableRow key={assignment._id}>
                                            <TableCell>{assignment.title}</TableCell>
                                            <TableCell>{formatDate(assignment.due_date)}</TableCell>
                                            <TableCell>{assignment.max_grade}</TableCell>
                                            <TableCell>
                                                {userSubmission
                                                    ? (userSubmission.grade !== null
                                                        ? `${userSubmission.grade}/${assignment.max_grade}`
                                                        : 'Not Graded')
                                                    : 'No Submission'}
                                            </TableCell>
                                            <TableCell>
                                                {userSubmission ? (
                                                    <Chip
                                                        size="sm"
                                                        color={
                                                            userSubmission.grade !== null
                                                                ? (userSubmission.grade >= 70 ? 'success' : 'danger')
                                                                : 'warning'
                                                        }
                                                    >
                                                        {userSubmission.grade !== null
                                                            ? (userSubmission.grade >= 70 ? 'Passed' : 'Failed')
                                                            : 'Pending'}
                                                    </Chip>
                                                ) : (
                                                    <Chip size="sm" color="neutral">No Submission</Chip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            </TableBody>
                        </Table>
                        <div className="mt-4 text-sm text-gray-500">
                            <p>Total Course Grade: Calculation Pending</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return renderOverviewSection();
            case 'modules': return renderModulesSection();
            case 'assignments': return renderAssignmentsSection();
            case 'people': return renderPeopleSection();
            case 'grades': return renderGradesSection();
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-6 space-y-4">
                <div className="text-center">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                        {courseData.course.cover_image_url ? (
                            <img
                                src={courseData.course.cover_image_url}
                                alt="Course Cover"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <BookOpen className="text-gray-500" size={48} />
                        )}
                    </div>
                    <h1 className="text-xl font-bold">{courseData.course.title || 'Untitled Course'}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Created: {formatDate(courseData.course.created_at)}
                    </p>
                </div>

                <div className="border-t my-4"></div>

                <div className="space-y-2">
                    {[
                        { key: 'overview', icon: BookOpen, label: 'Overview' },
                        { key: 'modules', icon: File, label: 'Modules' },
                        { key: 'people', icon: Users, label: 'People' },
                        { key: 'assignments', icon: Clipboard, label: 'Assignments' },
                        { key: 'grades', icon: Star, label: 'Grades' }
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveSection(item.key)}
                            className={`w-full text-left p-2 rounded flex items-center transition-colors ${
                                activeSection === item.key
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className="mr-2" size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {renderSection()}
            </div>
        </div>
    );
};

export default CourseStudyPage;
