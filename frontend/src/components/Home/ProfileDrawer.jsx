import React, { useState } from 'react';
import { useAuth } from "../../context/authContext";

export default function ProfileDrawer({ id }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const closeDrawer = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="text-center">
                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    type="button"
                    onClick={toggleDrawer}
                >
                    {user.profile_image ? (
                        <img
                            src={user.profile_image}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <i className="bi bi-person-circle" style={{ fontSize: "2em" }}></i>
                    )}
                </button>
            </div>

            <div
                id={id}
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } shadow-lg w-80`}
                style={{ backgroundColor: '#202F64' }}
                tabIndex="-1"
                aria-labelledby={`${id}-label`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h5
                        id={`${id}-label`}
                        className="inline-flex items-center text-base font-semibold text-gray-200"
                    >
                        Profile
                    </h5>
                    <button
                        className="text-gray-300 hover:text-gray-100"
                        onClick={closeDrawer}
                    >
                        X
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex items-center mb-4">
                    <img
                        src={user.profile_image || 'default-profile.png'}
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-3"
                    />
                    <div>
                        <a
                            href={`/profile/${user._id}`}
                            className="text-lg font-semibold text-gray-100 hover:underline"
                        >
                            {user.name || 'No Name Provided'}
                        </a>
                        <p className="text-sm text-gray-300">
                            Role: {user.role || 'Not specified'}
                        </p>
                    </div>
                </div>

                {/* Drawer Menu */}
                <div className="space-y-4">
                    <a href="/my-courses" className="block text-gray-100 hover:underline">
                        My Courses
                    </a>
                    <a href={`/profile/${user._id}`} className="block text-gray-100 hover:underline">
                        Profile
                    </a>
                    <a href="/subscription" className="block text-gray-100 hover:underline">
                        Subscription
                    </a>
                    <a href="/badges" className="block text-gray-100 hover:underline">
                        My Badges
                    </a>

                    <hr className="border-gray-600 my-4" />
                    <a href="/settings" className="block text-gray-100 hover:underline">
                        Settings
                    </a>
                    <a href="/help" className="block text-gray-100 hover:underline">
                        Help center
                    </a>
                    <button
                        onClick={() => /* logOutFunction */ {}}
                        className="w-full text-left text-gray-100 hover:underline"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
}
