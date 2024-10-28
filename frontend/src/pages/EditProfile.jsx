import React, { useState } from 'react';
import {useAuth} from "../context/authContext";
import {student} from "../services"

const EditProfile = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState(user.bio || '');
    const [profileImage, setProfileImage] = useState(user.profile_image || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
        }
    };

    return (
        <div className="max-w-md mx-auto my-8">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {success && <div className="mb-4 text-green-500">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">New Password (leave blank to keep current)</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block mb-1">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border rounded p-2"
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="profileImage" className="block mb-1">Profile Image URL</label>
                    <input
                        type="text"
                        id="profileImage"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white font-medium rounded-lg p-2 hover:bg-blue-800 focus:outline-none"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
