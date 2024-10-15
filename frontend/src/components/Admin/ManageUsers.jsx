import React, { useState } from 'react';
import { Form, Button, Accordion, Table } from 'react-bootstrap';
import { deleteUser, updateUser, registerUser } from '../../services/api';

const ManageUsers = ({ users, fetchData }) => {
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
    const [editUser, setEditUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        isEdit ? setEditUser({ ...editUser, [name]: value }) : setNewUser({ ...newUser, [name]: value });
    };

    const handleUserRegister = async (e) => {
        e.preventDefault();
        try {
            // Pass each field of newUser to the registerUser function
            await registerUser(newUser.name, newUser.email, newUser.password, newUser.role);
            fetchData(); // Refresh the user list
            setNewUser({ name: '', email: '', password: '', role: '' }); // Reset form fields
            setNotification({ message: 'User registered successfully.', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to register user.', type: 'error' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchData();
                setNotification({ message: 'User deleted successfully.', type: 'success' });
            } catch (error) {
                setNotification({ message: 'Failed to delete user.', type: 'error' });
            }
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editUser.id, editUser);
            fetchData();
            setEditUser(null);
            setNotification({ message: 'User updated successfully.', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to update user.', type: 'error' });
        }
    };

    return (
        <div>
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Register New User</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={handleUserRegister}>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Select name="role" value={newUser.role} onChange={handleInputChange} required>
                                    <option value="">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                            <Button type="submit">Register User</Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Table striped bordered hover responsive>
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
                            <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => setEditUser(user)}>Edit</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {editUser && (
                <Form onSubmit={handleUpdateUser} className="mt-4">
                    <h3>Update User</h3>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" name="name" placeholder="Name" value={editUser.name} onChange={(e) => handleInputChange(e, true)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="email" name="email" placeholder="Email" value={editUser.email} onChange={(e) => handleInputChange(e, true)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="password" name="password" placeholder="New Password (optional)" value={editUser.password || ''} onChange={(e) => handleInputChange(e, true)} />
                    </Form.Group>
                    <Button type="submit" className="me-2">Update User</Button>
                    <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
                </Form>
            )}

            {notification.message && (
                <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
