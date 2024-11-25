import React, { useState } from "react";
import { Table, Button as ReactButton, Form } from "react-bootstrap";
import { course } from "../../services";
import Notification from "../Notification";

const MajorManagement = ({ majors = [], fetchData }) => {
    const [newMajorName, setNewMajorName] = useState('');
    const [editingMajor, setEditingMajor] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleAddMajor = async () => {
        if (!newMajorName.trim()) return;
        try {
            await course.createMajors([newMajorName]);
            await fetchData();
            setNotification({ message: "Major added successfully!", type: "success" });
            setNewMajorName('');
        } catch (error) {
            setNotification({ message: "Failed to add major.", type: "error" });
        }
    };

    const handleUpdateMajor = async () => {
        if (!editingMajor || !editingMajor.name?.trim()) {
            setNotification({ message: "Invalid major name.", type: "error" });
            return;
        }
        try {
            await course.updateMajor(editingMajor._id, editingMajor.name);
            await fetchData();
            setNotification({ message: "Major updated successfully!", type: "success" });
            setEditingMajor(null);
        } catch (error) {
            setNotification({ message: "Failed to update major.", type: "error" });
        }
    };

    const handleDeleteMajor = async (majorId) => {
        if (!majorId) return;
        if (window.confirm("Are you sure you want to delete this major?")) {
            try {
                await course.deleteMajor(majorId);
                await fetchData();
                setNotification({ message: "Major deleted successfully!", type: "success" });
            } catch (error) {
                setNotification({ message: "Failed to delete major.", type: "error" });
            }
        }
    };

    return (
        <div>
            <h4>Manage Majors</h4>
            <Form className="mb-3">
                <Form.Group>
                    <Form.Label>New Major</Form.Label>
                    <Form.Control
                        type="text"
                        value={newMajorName}
                        onChange={(e) => setNewMajorName(e.target.value)}
                        placeholder="Enter major name"
                    />
                </Form.Group>
                <ReactButton variant="primary" className="mt-2" onClick={handleAddMajor}>
                    Add Major
                </ReactButton>
            </Form>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {majors.map((major) => (
                    <tr key={major._id}>
                        <td>
                            {editingMajor?._id === major._id ? (
                                <Form.Control
                                    type="text"
                                    value={editingMajor.name || ''}
                                    onChange={(e) =>
                                        setEditingMajor({ ...editingMajor, name: e.target.value })
                                    }
                                />
                            ) : (
                                major.name
                            )}
                        </td>
                        <td>
                            {editingMajor?._id === major._id ? (
                                <ReactButton
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={handleUpdateMajor}
                                >
                                    Save
                                </ReactButton>
                            ) : (
                                <ReactButton
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setEditingMajor(major)}
                                >
                                    Edit
                                </ReactButton>
                            )}
                            <ReactButton
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteMajor(major._id)}
                            >
                                Delete
                            </ReactButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {notification.message && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default MajorManagement;
