import React, { useEffect, useState } from 'react';
import {getAllUsers, getAllCourses, fetchMajors, fetchTags} from '../services/api';
import ManageCourses from "../components/Admin/ManageCourses";
import ManageUsers from "../components/Admin/ManageUsers";
import TextSkeleton from "../components/Skeletons/TextSkeleton";

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
        const userData = await getAllUsers();
        const majors = await fetchMajors()
        const tags = await fetchTags()
        setUsers(userData);
        setMajors(majors);
        setTags(tags);
        const courseData = await getAllCourses();
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
                            <a
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                href="#"
                                onClick={() => setActiveTab('users')}
                            >
                                Users
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                                href="#"
                                onClick={() => setActiveTab('courses')}
                            >
                                Courses
                            </a>
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