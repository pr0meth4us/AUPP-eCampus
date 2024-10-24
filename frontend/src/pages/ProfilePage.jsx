import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import bcrypt from 'bcryptjs';

const ProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const isOwnProfile = user._id === id;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="flex items-center mb-4">
                <img
                    src={user.profile_image || 'default-profile.png'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-3"
                />
                <div>
                    <h2 className="text-xl font-semibold">{user.name || 'No Name Provided'}</h2>
                    <p className="text-gray-600">{user.role || 'Not specified'}</p>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            {isOwnProfile && (
                <a
                    href="/edit-profile" // Route to edit profile page
                    className="text-blue-600 underline"
                >
                    Edit Profile
                </a>
            )}

            {user.role === 'student' && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Courses Enrolled:</h3>
                    <ul className="text-gray-500">
                        {(user.courses && user.courses.length > 0)
                            ? user.courses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))
                            : <li>No courses enrolled</li>
                        }
                    </ul>
                </div>
            )}

            {user.role === 'instructor' && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Courses Taught:</h3>
                    <ul className="text-gray-500">
                        {(user.courses && user.courses.length > 0)
                            ? user.courses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))
                            : <li>No courses taught</li>
                        }
                    </ul>
                    <h3 className="text-lg font-semibold">Expertise:</h3>
                    <p className="text-gray-500">{user.expertise || 'No expertise provided'}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

