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
                            className="w-8 h-8 rounded-full" // Adjust size for the button
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
                } bg-white w-80 dark:bg-gray-800 shadow-lg`}
                tabIndex="-1"
                aria-labelledby={`${id}-label`}
            >
                <h5
                    id={`${id}-label`}
                    className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
                >
                    Profile
                </h5>

                {/* Profile Section */}
                <div className="flex items-center mb-4">
                    <img
                        src={user.profile_image || 'default-profile.png'} // Fallback image
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-3"
                    />
                    <div>
                        <a
                            href={`/profile/${user._id}`} // Use the hashed user ID
                            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:underline"
                        >
                            {user.name || 'No Name Provided'}
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Role: {user.role || 'Not specified'}
                        </p>
                    </div>
                </div>

                {/* Other drawer content */}
            </div>
        </>
    );
}
