import React, { useEffect, useState } from 'react';
import { getAllUsers, registerInstructor, deleteUser, updateUser } from '../services/api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '' });
    const [updateData, setUpdateData] = useState({ id: '', name: '', email: '', password: '' });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [activeTab, setActiveTab] = useState('register'); // Track the active tab

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInstructorRegister = async () => {
        try {
            await registerInstructor(newInstructor);
            const data = await getAllUsers();
            setUsers(data);
            setNewInstructor({ name: '', email: '', password: '' });
        } catch (error) {
            console.error('Failed to register instructor:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (confirmDeleteId !== userId) {
            setConfirmDeleteId(userId);
            return;
        }

        try {
            await deleteUser(userId);
            const data = await getAllUsers();
            setUsers(data);
            setConfirmDeleteId(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            await updateUser(updateData.id, updateData);
            const data = await getAllUsers();
            setUsers(data);
            setUpdateData({ id: '', name: '', email: '', password: '' });
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>

            {/* Navigation Bar */}
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'register' ? 'bold' : 'normal' }} onClick={() => setActiveTab('register')}>
                        Register Instructor
                    </li>
                    <li style={{ cursor: 'pointer', fontWeight: activeTab === 'manage' ? 'bold' : 'normal' }} onClick={() => setActiveTab('manage')}>
                        Manage Users
                    </li>
                </ul>
            </nav>

            {/* Conditional Rendering Based on Active Tab */}
            {activeTab === 'register' && (
                <div>
                    <h3>Register Instructor</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newInstructor.name}
                        onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newInstructor.email}
                        onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newInstructor.password}
                        onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                    />
                    <button onClick={handleInstructorRegister}>Register Instructor</button>
                </div>
            )}

            {activeTab === 'manage' && (
                <div>
                    <h3>All Users</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {confirmDeleteId === user.id ? (
                                        <>
                                            <span>Are you sure?</span>
                                            <button onClick={() => handleDeleteUser(user.id)}>Yes</button>
                                            <button onClick={() => setConfirmDeleteId(null)}>No</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                            <button onClick={() => setUpdateData({ id: user.id, name: user.name, email: user.email, password: '' })}>Edit</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {updateData.id && (
                        <div>
                            <h3>Update User</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={updateData.name}
                                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={updateData.email}
                                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={updateData.password}
                                onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                            />
                            <button onClick={handleUpdateUser}>Update User</button>
                            <button onClick={() => setUpdateData({ id: '', name: '', email: '', password: '' })}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
