import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Construction } from 'lucide-react';
import "../../assets/css/elements/banner.css";
import {handleUnderConstructionClick} from "../../utils/handleUnderconstructionClick";

const Banner = () => {
    const { i18n } = useTranslation();
    const isKhmer = i18n.language === 'km';


    return (
        <div className="banner bg-primary flex justify-center items-center py-2 relative">
            {/* Show Khmer under development notice if Khmer is selected */}
            {isKhmer && (
                <div className="absolute inset-0 bg-amber-500/90 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-white font-medium">
                        <Construction className="w-4 h-4" />
                        <span>ភាសាខ្មែរកំពុងត្រូវបានអភិវឌ្ឍន៍ | Khmer language is under development</span>
                    </div>
                </div>
            )}

            {/* Regular banner content */}
            <div className={`flex items-center space-x-1 text-sm ${isKhmer ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <div>
                    <Link
                        className="text-white hover:text-gray-200 transition-colors"
                        to="https://www.aupp.edu.kh/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        AUPP<span className="mx-2 text-gray-300">|</span>
                    </Link>
                </div>
                <div>
                    <Link
                        className="text-white hover:text-gray-200 transition-colors"
                        to="/news-events"
                        onClick={handleUnderConstructionClick}
                        rel="noopener noreferrer"
                    >
                        News & Events<span className="mx-2 text-gray-300">|</span>
                    </Link>
                </div>
                <div>
                    <Link
                        className="text-white hover:text-gray-200 transition-colors"
                        to="https://www.aupp.edu.kh/student-life/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Student Life
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;