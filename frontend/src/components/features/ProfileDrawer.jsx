import React, { useState } from 'react';
import { useAuth } from "../../context/authContext";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import {
    User,
    BookOpen,
    GraduationCap,
    Plus,
    Award,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    X
} from 'lucide-react';
import {handleUnderConstructionClick} from "../../utils/handleUnderconstructionClick";

export default function DrawerButton({ id }) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
                    onClick={toggleDrawer}
                />
            )}

            <button
                className="flex items-center text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                type="button"
                onClick={toggleDrawer}
            >
                {user.profile_image ? (
                    <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                    />
                ) : (
                    <Avatar
                        icon={<AvatarIcon />}
                        classNames={{
                            base: "w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 ring-2 ring-white/20",
                            icon: "text-white/90",
                        }}
                    />
                )}
            </button>

            <div
                id={id}
                className={`fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-2xl transition-transform transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } border-l border-gray-100`}
                tabIndex="-1"
                aria-labelledby={`${id}-label`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-primary text-white">
                    <h5 id={`${id}-label`} className="text-xl font-semibold">
                        Account
                    </h5>
                    <button
                        onClick={toggleDrawer}
                        aria-label="Close drawer"
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                    <div className="flex items-center gap-4">
                        {user.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                            />
                        ) : (
                            <Avatar
                                icon={<AvatarIcon />}
                                classNames={{
                                    base: "w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-gray-200 shadow-sm",
                                    icon: "text-white/90",
                                }}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <a
                                href={`/profile/${user._id}`}
                                className="block text-lg font-semibold text-gray-900 hover:text-slate-700 transition-colors truncate"
                            >
                                {user.name || 'No Name'}
                            </a>
                            <p className="text-sm text-gray-600 capitalize">
                                {user.role || 'Role Not Specified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {/* Role-specific links */}
                    {user.role === 'student' && (
                        <a
                            href="/my-courses"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-gray-700 hover:text-slate-800 transition-all duration-200 group"
                        >
                            <BookOpen className="w-5 h-5 text-slate-600 group-hover:text-slate-700" />
                            <span className="font-medium">My Courses</span>
                        </a>
                    )}

                    {user.role === 'instructor' && (
                        <>
                            <a
                                href="/course-i-teach"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-gray-700 hover:text-slate-800 transition-all duration-200 group"
                            >
                                <GraduationCap className="w-5 h-5 text-slate-600 group-hover:text-slate-700" />
                                <span className="font-medium">Courses I Teach</span>
                            </a>
                            <a
                                href="/instructor/course/create"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 transition-all duration-200 group border border-emerald-100"
                            >
                                <Plus className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                                <span className="font-medium">Create Course</span>
                            </a>
                        </>
                    )}

                    {/* Common links */}
                    <a
                        href={`/profile/${user._id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-200 group"
                    >
                        <User className="w-5 h-5 text-gray-500 group-hover:text-gray-600" />
                        <span className="font-medium">Profile</span>
                    </a>

                    {/* Under construction items */}
                    <a
                        href="/subscription"
                        onClick={handleUnderConstructionClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-200 group"
                    >
                        <CreditCard className="w-5 h-5 text-gray-500 group-hover:text-gray-600" />
                        <span className="font-medium">Subscription</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Soon</span>
                    </a>

                    <a
                        href="/badges"
                        onClick={handleUnderConstructionClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-200 group"
                    >
                        <Award className="w-5 h-5 text-gray-500 group-hover:text-gray-600" />
                        <span className="font-medium">My Badges</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Soon</span>
                    </a>

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-200"></div>

                    <a
                        href="/settings"
                        onClick={handleUnderConstructionClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-200 group"
                    >
                        <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-600" />
                        <span className="font-medium">Settings</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Soon</span>
                    </a>

                    <a
                        href="/help"
                        onClick={handleUnderConstructionClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-200 group"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-gray-600" />
                        <span className="font-medium">Help Center</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Soon</span>
                    </a>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 group border border-red-100"
                    >
                        <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}