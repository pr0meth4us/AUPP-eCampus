import React, { useState } from 'react';
import {
    Input,
    Button,
    Avatar,
    Card,
    CardBody,
    CardHeader
} from "@nextui-org/react";
import {
    CameraIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from "../context/authContext";
import { student } from "../services";
import { Textarea } from "@nextui-org/input";

const EditProfilePage = () => {
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profileImageUpload"
                    />
                    <label htmlFor="profileImageUpload" className="cursor-pointer relative group">
                        <Avatar
                            src={profileImage}
                            fallback={<UserIcon className="h-16 w-16 text-gray-500" />}
                            icon={<UserIcon className="w-16 h-16 text-gray-400" />}
                            className="w-36 h-36 border-4 border-white group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <CameraIcon className="w-12 h-12 text-white bg-black/50 rounded-full p-2" />
                        </div>
                    </label>
                    <h2 className="text-2xl font-bold text-white mt-4">Edit Profile</h2>
                </CardHeader>

                <CardBody className="p-6">
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
                            startContent={<UserIcon className="w-5 h-5 text-default-400" />}
                            label="Name"
                            value={name}
                            onValueChange={setName}
                            variant="bordered"
                            required
                        />
                        <Input
                            type="email"
                            startContent={<EnvelopeIcon className="w-5 h-5 text-default-400" />}
                            label="Email"
                            value={email}
                            onValueChange={setEmail}
                            variant="bordered"
                            required
                        />
                        <Input
                            type="password"
                            startContent={<LockClosedIcon className="w-5 h-5 text-default-400" />}
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
                            className="mt-4"
                        >
                            Update Profile
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default EditProfilePage;