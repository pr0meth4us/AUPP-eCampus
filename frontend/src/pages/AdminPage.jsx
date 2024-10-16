import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllCourses } from '../services/api';
import ManageCourses from "../components/Admin/ManageCourses";
import ManageUsers from "../components/Admin/ManageUsers";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userData = await getAllUsers();
            setUsers(userData);
            const courseData = await getAllCourses();
            setCourses(courseData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
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
            {activeTab === 'courses' && <ManageCourses users={users} courses={courses} setCourses={setCourses} fetchData={fetchData} />}
        </div>
    );
};

export default AdminPage;