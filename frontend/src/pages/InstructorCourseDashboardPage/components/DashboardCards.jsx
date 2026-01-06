// components/DashboardCards.jsx

import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const DashboardCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardBody className="p-4 text-center">
          <UsersIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-xs text-gray-500">Students</p>
          <p className="text-xl font-bold">{stats.enrolledStudents}</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-4 text-center">
          <BookOpenIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-xs text-gray-500">Modules</p>
          <p className="text-xl font-bold">{stats.modules}</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-4 text-center">
          <AcademicCapIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-xs text-gray-500">Assignments</p>
          <p className="text-xl font-bold">{stats.assignments}</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-4 text-center">
          <ChartBarIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-xs text-gray-500">Total Submissions</p>
          <p className="text-xl font-bold">{stats.totalSubmissions}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardCards;
