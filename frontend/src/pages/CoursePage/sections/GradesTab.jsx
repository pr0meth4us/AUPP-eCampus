import React from "react";
import { Button } from "@nextui-org/react";

const GradesTab = () => (
    <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">Your grades will be displayed here.</p>
        <Button color="primary" variant="solid">
            View Grades
        </Button>
    </div>
);

export default GradesTab;
