import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const isOwnProfile = user?._id === id;

    return (
        <div className="max-w-4xl mx-auto mt-[100px] mb-16 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
                {isOwnProfile && (
                    <Link
                        to="/edit-profile"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Edit Profile
                    </Link>
                )}
            </div>

            <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <img
                    src={user?.profile_image || '/default-profile.png'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                />
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{user?.name || 'No Name'}</h2>
                    <p className="text-gray-600">{user?.role || 'Role Not Specified'}</p>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
            </div>

            {user?.role === 'student' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Courses Enrolled</h3>
                    {user?.courses && user.courses.length > 0 ? (
                        <ul className="space-y-2 text-gray-700">
                            {user.courses.map((course, index) => (
                                <li
                                    key={index}
                                    className="bg-white p-2 rounded shadow-sm hover:bg-blue-50 transition-colors"
                                >
                                    {course}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No courses enrolled</p>
                    )}
                </div>
            )}

            {user?.role === 'instructor' && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Courses Taught</h3>
                        {user?.courses && user.courses.length > 0 ? (
                            <ul className="space-y-2 text-gray-700">
                                {user.courses.map((course, index) => (
                                    <li
                                        key={index}
                                        className="bg-white p-2 rounded shadow-sm hover:bg-blue-50 transition-colors"
                                    >
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No courses taught</p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Expertise</h3>
                        <p className="text-gray-600">{user?.expertise || 'No expertise provided'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;