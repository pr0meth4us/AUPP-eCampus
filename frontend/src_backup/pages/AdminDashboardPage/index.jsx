import React, { useEffect, useState } from 'react';
import {admin, course} from 'services';
import ManageUsers from "./sections/user/ManageUsers";
import ManageCourses from "./sections/course/ManageCourses";
import TextSkeleton from "components/skeletons/TextSkeleton";


const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [majors, setMajors] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const userData = await admin.getAllUsers();
        const majors = await course.fetchMajors()
        const tags = await course.fetchTags()
        setUsers(userData);
        setMajors(majors);
        setTags(tags);
        const courseData = await admin.getAllCourses();
        setCourses(courseData);
        setLoading(false);
    };

    if (loading) {
        return (
            <TextSkeleton/>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Manage</span>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button
                                className={`nav-link btn btn-link p-0 ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                Users
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link btn btn-link p-0 ${activeTab === 'courses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('courses')}
                            >
                                Courses
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {activeTab === 'users' && <ManageUsers users={users} setUsers={setUsers} fetchData={fetchData} />}
            {activeTab === 'courses' && <ManageCourses users={users} courses={courses} setCourses={setCourses} fetchData={fetchData} majors={majors} tags={tags}/>}
        </div>
    );
};

export default AdminPage;