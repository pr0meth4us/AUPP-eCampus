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
                    <svg
                        className="w-4 h-4 mr-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    Profile
                </h5>

                <button
                    type="button"
                    onClick={toggleDrawer}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center mb-4">
                    <img
                        src={user.profile_image || 'default-profile.png'} // Fallback image
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-3"
                    />
                    <div>
                        <a
                            href={`/profile/${user.email}`}
                            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:underline"
                        >
                            {user.name || 'No Name Provided'}
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Role: {user.role || 'Not specified'}
                        </p>
                    </div>
                </div>

                <h6 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Courses:
                </h6>
                <a
                    href="/courses"
                    className="text-blue-600 hover:underline mb-4"
                >
                    View all courses
                </a>

                {user.role === 'instructor' && (
                    <div>
                        <h6 className="font-semibold text-gray-700 dark:text-gray-300">Expertise:</h6>
                        <p className="text-gray-500 dark:text-gray-400">
                            {user.expertise || 'No expertise provided'}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
