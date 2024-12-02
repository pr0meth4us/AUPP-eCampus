import React, { useState } from "react";
import { Table, Button as ReactButton, Form } from "react-bootstrap";
import {course} from "../../../../services";
import Notification from "../../../../components/common/Notification";
const TagManagement = ({ tags = [], fetchData }) => {
    const [newTagName, setNewTagName] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleAddTag = async () => {
        if (!newTagName.trim()) return;
        try {
            await course.createTags([newTagName]);
            await fetchData();
            setNotification({ message: "Tag added successfully!", type: "success" });
            setNewTagName('');
        } catch (error) {
            setNotification({ message: "Failed to add tag.", type: "error" });
        }
    };

    const handleUpdateTag = async () => {
        if (!editingTag || !editingTag.name?.trim()) {
            setNotification({ message: "Invalid tag name.", type: "error" });
            return;
        }
        try {
            await course.updateTag(editingTag._id, editingTag.name);
            await fetchData();
            setNotification({ message: "Tag updated successfully!", type: "success" });
            setEditingTag(null);
        } catch (error) {
            setNotification({ message: "Failed to update tag.", type: "error" });
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (!tagId) return;
        if (window.confirm("Are you sure you want to delete this tag?")) {
            try {
                await course.deleteTag(tagId);
                await fetchData();
                setNotification({ message: "Tag deleted successfully!", type: "success" });
            } catch (error) {
                setNotification({ message: "Failed to delete tag.", type: "error" });
            }
        }
    };

    return (
        <div>
            <h4>Manage Tags</h4>
            <Form className="mb-3">
                <Form.Group>
                    <Form.Label>New Tag</Form.Label>
                    <Form.Control
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name"
                    />
                </Form.Group>
                <ReactButton variant="primary" className="mt-2" onClick={handleAddTag}>
                    Add Tag
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
                {tags.map((tag) => (
                    <tr key={tag._id}>
                        <td>
                            {editingTag?._id === tag._id ? (
                                <Form.Control
                                    type="text"
                                    value={editingTag.name || ''}
                                    onChange={(e) =>
                                        setEditingTag({ ...editingTag, name: e.target.value })
                                    }
                                />
                            ) : (
                                tag.name
                            )}
                        </td>
                        <td>
                            {editingTag?._id === tag._id ? (
                                <ReactButton
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={handleUpdateTag}
                                >
                                    Save
                                </ReactButton>
                            ) : (
                                <ReactButton
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setEditingTag(tag)}
                                >
                                    Edit
                                </ReactButton>
                            )}
                            <ReactButton
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteTag(tag._id)}
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

export default TagManagement;
