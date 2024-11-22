import React, { useState } from 'react';
import { useAuth } from "../../context/authContext";

export default function DrawerButton({ id }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                className="flex items-center   text-white rounded-full shadow-md transition-colors"
                type="button"
                onClick={toggleDrawer}
            >
                {user.profile_image ? (
                    <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <i className="bi bi-person-circle text-2xl"></i>
                )}
            </button>

            {/* Drawer */}
            <div
                id={id}
                className={`fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-lg transition-transform transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                tabIndex="-1"
                aria-labelledby={`${id}-label`}
            >
                {/* Drawer Header */}
                <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
                    <h5 id={`${id}-label`} className="text-lg font-bold">
                        Profile
                    </h5>
                    <button
                        onClick={toggleDrawer}
                        aria-label="Close drawer"
                        className="text-white hover:text-gray-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Profile Section */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-4">
                        <img
                            src={user.profile_image || '/default-profile.png'}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                        />
                        <div>
                            <a
                                href={`/profile/${user._id}`}
                                className="block text-xl font-bold text-gray-800 hover:underline"
                            >
                                {user.name || 'No Name'}
                            </a>
                            <p className="text-sm text-gray-600">
                                {user.role || 'Role Not Specified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-2">
                    <a
                        href="/my-courses"
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        My Courses
                    </a>
                    <a
                        href={`/profile/${user._id}`}
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        Profile
                    </a>
                    <a
                        href="/subscription"
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        Subscription
                    </a>
                    <a
                        href="/badges"
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        My Badges
                    </a>
                    <hr className="my-4 border-gray-300" />
                    <a
                        href="/settings"
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        Settings
                    </a>
                    <a
                        href="/help"
                        className="block px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        Help Center
                    </a>
                    <button
                        onClick={() => /* logOutFunction */ {}}
                        className="w-full text-left px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
}
