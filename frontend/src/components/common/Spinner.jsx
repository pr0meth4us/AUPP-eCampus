import React from "react";
import { Spinner as NextUISpinner } from "@nextui-org/react";

const Spinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <NextUISpinner size="lg" color="primary" />
        </div>
    );
};

export default Spinner;
