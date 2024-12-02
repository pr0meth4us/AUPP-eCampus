import React from "react";

const Loading = ({ message = "Loading..." }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>{message}</p>
    </div>
);

export default Loading;
