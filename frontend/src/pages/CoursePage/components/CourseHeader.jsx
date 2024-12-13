import React from "react";

const CourseHeader = ({ course }) => (
    <div className="relative mb-6">
        <div className="w-full aspect-[16/6] bg-black rounded-xl overflow-hidden shadow-xl">
            <img
                alt={`Cover for ${course.title}`}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                src={course.cover_image_url || "/Course-Placeholder.jpg"}
                onError={(e) => {
                    e.target.src = "/Course-Placeholder.jpg";
                    e.target.classList.add("opacity-50");
                }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            </div>
        </div>
    </div>
);

export default CourseHeader;
