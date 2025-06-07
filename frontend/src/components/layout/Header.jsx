import React from 'react';
import Banner from "./Banner";
import "../../assets/css/components/search-bar.css";
import "../../assets/css/elements/header.css";
import { Link } from "react-router-dom";
import LoginPage from "../features/Login";
import Signup from "../features/Signup";
import { useAuth } from "../../context/authContext";
import DrawerButton from "../features/ProfileDrawer";
import LanguageSwitcher from "../features/LanguageSwitcher";
import { Search, Compass } from "lucide-react";
import {handleUnderConstructionClick} from "../../utils/handleUnderconstructionClick";

const Header = () => {
    const { user } = useAuth();

    return (
        <>
            <Banner />
            <header className="bg-white shadow-sm border-b border-gray-100 py-3 fixed-top">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="logo">
                        <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img
                                src="/aupp_ecampus_logo.png"
                                alt="AUPP eCampus Logo"
                                className="w-12 h-12 object-contain"
                            />
                        </a>
                    </div>

                    {/* Search Bar */}
                    <form action="/search" method="GET" className="flex-1 max-w-md mx-6">
                        <div className="relative">
                            <input
                                type="text"
                                name="query"
                                placeholder="Search courses, topics..."
                                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-slate-600 transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        {/* Find Your Pathway */}
                        <button
                            onClick={handleUnderConstructionClick}
                            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors group"
                        >
                            <Compass className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                            <span>Find Your Pathway</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Soon
                            </span>
                        </button>

                        {/* User Actions */}
                        {user ? (
                            <DrawerButton id='profile-drawer'/>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                                    data-bs-toggle="modal"
                                    data-bs-target="#login"
                                >
                                    Login
                                </button>
                                <LoginPage/>

                                <button
                                    type="button"
                                    className="px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    data-bs-toggle="modal"
                                    data-bs-target="#signup"
                                >
                                    Join for free
                                </button>
                                <Signup />
                            </div>
                        )}

                        {/* Language Switcher */}
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;