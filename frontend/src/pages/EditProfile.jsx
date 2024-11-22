import React, { useState } from 'react';
import { Input, Button, Avatar } from "@nextui-org/react";
import { useAuth } from "../context/authContext";
import { student } from "../services";
import {Textarea} from "@nextui-org/input";

const EditProfile = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState(user.bio || '');
    const [profileImage, setProfileImage] = useState(user.profile_image || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);

            try {
                const response = await student.uploadProfileImage(formData);
                setProfileImage(response.imageUrl);
            } catch (err) {
                setError('Failed to upload image');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await student.updateProfile(user._id, {
                name,
                email,
                password,
                bio,
                profile_image: profileImage
            });

            if (response.status === 200) {
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating the profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col items-center mb-6">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profileImageUpload"
                />
                <label htmlFor="profileImageUpload" className="cursor-pointer">
                    <Avatar
                        src={profileImage || '/default-avatar.png'}
                        className="w-24 h-24 mb-4 hover:opacity-75 transition-opacity"
                    />
                </label>
                <p className="text-sm text-gray-500">Click avatar to upload new picture</p>
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Name"
                    value={name}
                    onValueChange={setName}
                    variant="bordered"
                    required
                />
                <Input
                    type="email"
                    label="Email"
                    value={email}
                    onValueChange={setEmail}
                    variant="bordered"
                    required
                />
                <Input
                    type="password"
                    label="New Password"
                    value={password}
                    onValueChange={setPassword}
                    description="Leave blank to keep current password"
                    variant="bordered"
                />
                <Textarea
                    label="Bio"
                    value={bio}
                    onValueChange={setBio}
                    variant="bordered"
                    minRows={3}
                />
                <Button
                    color="primary"
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                >
                    Update Profile
                </Button>
            </form>
        </div>
    );
};

export default EditProfile;