// src/pages/CourseDashboardPage.jsx

import React, { useState } from 'react';
import { Spinner } from '@heroui/react';
import OverviewSection from "./sections/OverviewSection";
import ModulesSection from "./sections/ModulesSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import PeopleSection from "./sections/PeopleSection";
import GradesSection from "./sections/GradesSection";
import CourseSidebar from "./components/CourseSidebar";
import {useCourseDetails} from "../../hooks/useCourseFetch";



const CourseDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const { course: courseData, loading, error } = useCourseDetails('detail');

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

    if (!courseData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>No course data available</p>
            </div>
        );
    }

    // Decide which section component to render
    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <OverviewSection courseData={courseData} />;
            case 'modules':
                return <ModulesSection courseData={courseData} />;
            case 'assignments':
                return <AssignmentsSection courseData={courseData} />;
            case 'people':
                return <PeopleSection courseData={courseData} />;
            case 'grades':
                return <GradesSection courseData={courseData} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <CourseSidebar
                courseData={courseData}
                activeSection={activeSection}
                onSelectSection={setActiveSection}
            />
            <div className="flex-1 p-6 overflow-y-auto">{renderSection()}</div>
        </div>
    );
};

export default CourseDashboardPage;
