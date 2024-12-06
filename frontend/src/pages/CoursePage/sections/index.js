import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import OverviewTab from "./OverviewTab";
import AssignmentsTab from "./AssignmentsTab";
import ModulesTab from "./ModulesTab";
import GradesTab from "./GradesTab";
import PeopleTab from "./PeopleTab";

const TabsContainer = ({ course }) => {
    const [selectedTab, setSelectedTab] = useState("overview");

    return (
        <Tabs
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            color="primary"
            variant="underlined"
            className="mb-4"
        >
            <Tab key="overview" title="Overview">
                <OverviewTab course={course} />
            </Tab>
            <Tab key="assignments" title="Assignments">
                <AssignmentsTab assignments={course.assignments} />
            </Tab>
            <Tab key="modules" title="Modules">
                <ModulesTab />
            </Tab>
            <Tab key="grades" title="Grades">
                <GradesTab />
            </Tab>
            <Tab key="people" title="People">
                <PeopleTab course={course} />
            </Tab>
        </Tabs>
    );
};

export default TabsContainer;
