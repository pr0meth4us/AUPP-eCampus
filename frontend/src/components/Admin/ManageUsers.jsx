import React, { useState } from 'react';
import { registerInstructor, deleteUser, updateUser } from '../../services/api';

const ManageUsers = ({ users, setUsers, fetchData }) => {
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '' });
    const [updateUserData, setUpdateUserData] = useState({ id: '', name: '', email: '', password: '' });
    const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInstructorRegister = async (e) => {
        e.preventDefault();
        if (!newInstructor.name || !newInstructor.email || !newInstructor.password) {
            setError('All fields are required for instructor registration.');
            return;
        }

        try {
            await registerInstructor(newInstructor);
            await fetchData();
            setNewInstructor({ name: '', email: '', password: '' });
            setSuccess('Instructor registered successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to register instructor:', error);
            setError('Failed to register instructor. Please try again.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (confirmDeleteUserId !== userId) {
            setConfirmDeleteUserId(userId);
            return;
        }

        try {
            await deleteUser(userId);
            await fetchData();
            setConfirmDeleteUserId(null);
            setSuccess('User deleted successfully.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            setError('Failed to delete user. Please try again.');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!updateUserData.name || !updateUserData.email) {
            setError('Name and email are required for updating a user.');
            return;
        }

        try {
            await updateUser(updateUserData.id, updateUserData);
            await fetchData();
            setUpdateUserData({ id: '', name: '', email: '', password: '' });
            setSuccess('User updated successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to update user:', error);
            setError('Failed to update user. Please try again.');
        }
    };

    return (
        <div>
            <h3>Register New Instructor</h3>
            <form onSubmit={handleInstructorRegister}>
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
                <button type="submit">Register Instructor</button>
            </form>

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
                            {confirmDeleteUserId === user.id ? (
                                <>
                                    <span>Are you sure?</span>
                                    <button onClick={() => handleDeleteUser(user.id)}>Yes</button>
                                    <button onClick={() => setConfirmDeleteUserId(null)}>No</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    <button onClick={() => setUpdateUserData({ id: user.id, name: user.name, email: user.email, password: '' })}>Edit</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {updateUserData.id && (
                <div>
                    <h3>Update User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={updateUserData.name}
                            onChange={(e) => setUpdateUserData({ ...updateUserData, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={updateUserData.email}
                            onChange={(e) => setUpdateUserData({ ...updateUserData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="New Password (optional)"
                            value={updateUserData.password}
                            onChange={(e) => setUpdateUserData({ ...updateUserData, password: e.target.value })}
                        />
                        <button type="submit">Update User</button>
                        <button onClick={() => setUpdateUserData({ id: '', name: '', email: '', password: '' })}>Cancel</button>
                    </form>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default ManageUsers;
