import React, { useEffect, useState } from 'react';
import { getAllUsers, registerInstructor } from '../services/api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '' });

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
            // Optionally, fetch users again to refresh the list
            const data = await getAllUsers();
            setUsers(data);
            setNewInstructor({ name: '', email: '', password: '' }); // Reset form
        } catch (error) {
            console.error('Failed to register instructor:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
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
            <h3>All Users</h3>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
