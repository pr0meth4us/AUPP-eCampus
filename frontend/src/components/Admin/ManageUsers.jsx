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
            <section className="mb-4">
                <h3>Register New Instructor</h3>
                <form onSubmit={handleInstructorRegister} className="mb-3">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={newInstructor.name}
                            onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={newInstructor.email}
                            onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={newInstructor.password}
                            onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register Instructor</button>
                </form>
            </section>

            <section>
                <h3>All Users</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
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
                                            <span className="me-2">Are you sure?</span>
                                            <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-danger me-1">Yes</button>
                                            <button onClick={() => setConfirmDeleteUserId(null)} className="btn btn-sm btn-secondary">No</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-outline-danger me-1">Delete</button>
                                            <button onClick={() => setUpdateUserData({ id: user.id, name: user.name, email: user.email, password: '' })} className="btn btn-sm btn-outline-secondary">Edit</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {updateUserData.id && (
                <section className="mt-4">
                    <h3>Update User</h3>
                    <form onSubmit={handleUpdateUser} className="mb-3">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={updateUserData.name}
                                onChange={(e) => setUpdateUserData({ ...updateUserData, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={updateUserData.email}
                                onChange={(e) => setUpdateUserData({ ...updateUserData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New Password (optional)"
                                value={updateUserData.password}
                                onChange={(e) => setUpdateUserData({ ...updateUserData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Update User</button>
                        <button onClick={() => setUpdateUserData({ id: '', name: '', email: '', password: '' })} className="btn btn-secondary">Cancel</button>
                    </form>
                </section>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
        </div>
    );
};

export default ManageUsers;