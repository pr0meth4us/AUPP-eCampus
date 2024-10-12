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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'users' ? 'bold' : 'normal' }} onClick={() => setActiveTab('users')}>
                        Manage Users
                    </li>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'courses' ? 'bold' : 'normal' }} onClick={() => setActiveTab('courses')}>
                        Manage Courses
                    </li>
                </ul>
            </nav>

            {activeTab === 'users' && <ManageUsers users={users} setUsers={setUsers} fetchData={fetchData} />}
            {activeTab === 'courses'  && <ManageCourses users={users} courses={courses} setCourses={setCourses} fetchData={fetchData} />}
        </div>
    );
};

export default AdminPage;
