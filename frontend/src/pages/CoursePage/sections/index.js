import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { Lock } from "lucide-react";
import OverviewTab from "./OverviewTab";
import AssignmentsTab from "./AssignmentsTab";
import ModulesTab from "./ModulesTab";
import GradesTab from "./GradesTab";
import PeopleTab from "./PeopleTab";

const TabsContainer = ({ course, assignments, modules, people }) => {
    const [selectedTab, setSelectedTab] = useState("overview");

    // Check if each section has data
    const hasOverview = course?.description || course?.major_names?.length || course?.tag_names?.length;
    const hasAssignments = assignments?.length > 0;
    const hasModules = modules?.length > 0;
    const hasPeople = people?.instructor || people?.students?.length > 0;

    const renderTabContent = (key, component) => {
        const isDisabled = !{
            'overview': hasOverview,
            'assignments': hasAssignments,
            'modules': hasModules,
            'grades': hasAssignments,
            'people': hasPeople
        }[key];

        return (
            <Tab
                key={key}
                title={
                    <div className="flex items-center gap-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {isDisabled && <Lock size={14} className="text-gray-400" />}
                    </div>
                }
                isDisabled={isDisabled}
            >
                {component}
            </Tab>
        );
    };

    return (
        <Tabs
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            color="primary"
            variant="underlined"
            className="mb-4"
        >
            {renderTabContent('overview', <OverviewTab course={course} />)}
            {renderTabContent('assignments', <AssignmentsTab assignments={assignments} />)}
            {renderTabContent('modules', <ModulesTab modules={modules} />)}
            {renderTabContent('grades', <GradesTab />)}
            {renderTabContent('people', <PeopleTab course={people} />)}
        </Tabs>
    );
};

export default TabsContainer;