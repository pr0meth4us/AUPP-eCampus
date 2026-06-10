import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { course as CourseApi } from "../services";
import { Pagination } from "@heroui/react";
import CardVideoSkeleton from "../components/skeletons/CardVideoSkeleton";
import { User, BookOpen } from "lucide-react";

const CourseCatalogPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CourseApi.getAllCourses();
            setCourses(data || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError("SERVER OFFLINE. UNABLE TO RETRIEVE COURSE DATA.");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseOverview = (courseId) => {
        const isEnrolled = user?.courses?.includes(courseId);
        navigate(
            isEnrolled
                ? `/course/${courseId}`
                : `/course/preview/${courseId}`
        );
    };

    const indexOfLast = currentPage * coursesPerPage;
    const indexOfFirst = indexOfLast - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <div className="min-h-screen py-16 px-6 bg-brutal-bg max-w-7xl mx-auto">
            <div className="border-b-8 border-brutal-black pb-8 mb-12 flex justify-between items-end">
                <div>
                    <span className="bg-brutal-yellow border-2 border-brutal-black px-2 py-1 font-bold uppercase text-sm mb-2 inline-block">
                        ALL PROGRAMS
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                        COURSE CATALOG
                    </h1>
                </div>
                <div className="hidden md:block font-bold text-2xl bg-white border-4 border-brutal-black px-4 py-2 shadow-brutal rotate-3">
                    {courses.length} MODULES ONLINE
                </div>
            </div>

            {error && (
                <div className="bg-brutal-red border-4 border-brutal-black p-8 brutal-card mb-12">
                    <h2 className="text-4xl font-black text-white uppercase tracking-wider">{error}</h2>
                    <p className="text-xl font-bold text-white mt-2">Please ensure the backend API is running on localhost:5001.</p>
                </div>
            )}

            {loading ? (
                <CardVideoSkeleton />
            ) : !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentCourses.map((c) => (
                            <div
                                key={c._id}
                                className="relative flex flex-col bg-white border-4 border-brutal-black shadow-brutal brutal-card overflow-hidden group cursor-pointer"
                                onClick={() => handleCourseOverview(c._id)}
                            >
                                {/* Brutalist Price Tag */}
                                <div className={`absolute top-4 right-4 z-10 px-4 py-1 border-4 border-brutal-black font-black uppercase tracking-widest text-sm shadow-brutal ${
                                    c.price === "0"
                                        ? "bg-brutal-yellow text-brutal-black"
                                        : "bg-brutal-red text-white"
                                }`}>
                                    {c.price === "0" ? "FREE ACCESS" : "PREMIUM"}
                                </div>

                                {/* Thumbnail Area */}
                                <div className="h-56 bg-brutal-blue border-b-4 border-brutal-black relative overflow-hidden">
                                    <img
                                        src={c.cover_image_url || "/Course-Placeholder.jpg"}
                                        alt={`Cover for ${c.title}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"; // Tech placeholder
                                        }}
                                    />
                                    {/* Glitch Overlay Effect */}
                                    <div className="absolute inset-0 bg-brutal-black/20 mix-blend-multiply group-hover:bg-transparent transition-colors"></div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-black text-2xl uppercase leading-tight line-clamp-2 mb-4 group-hover:text-brutal-blue transition-colors">
                                            {c.title}
                                        </h3>
                                        <div className="flex items-center text-brutal-black font-bold uppercase text-sm border-l-4 border-brutal-yellow pl-3">
                                            <User size={18} className="mr-2" />
                                            <span className="truncate">{c.instructor_name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <button className="w-full bg-brutal-black text-white py-3 font-bold uppercase tracking-wider border-2 border-brutal-black brutal-button flex justify-center items-center gap-2 group-hover:bg-brutal-blue group-hover:border-brutal-blue">
                                            <BookOpen size={20} /> INITIALIZE MODULE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-16 pb-8">
                            <div className="bg-white border-4 border-brutal-black p-2 shadow-brutal">
                                <Pagination
                                    total={totalPages}
                                    initialPage={currentPage}
                                    onChange={setCurrentPage}
                                    color="default"
                                    classNames={{
                                        wrapper: "gap-2",
                                        item: "border-2 border-brutal-black font-bold text-lg bg-brutal-bg text-brutal-black hover:bg-brutal-yellow rounded-none",
                                        cursor: "border-2 border-brutal-black bg-brutal-black text-white font-bold rounded-none",
                                        prev: "border-2 border-brutal-black bg-brutal-bg hover:bg-brutal-yellow rounded-none text-brutal-black",
                                        next: "border-2 border-brutal-black bg-brutal-bg hover:bg-brutal-yellow rounded-none text-brutal-black",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CourseCatalogPage;
