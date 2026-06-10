import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsDropdownOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Select language"
            >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
            </button>

            {isDropdownOpen && (
                <ul
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50"
                    role="listbox"
                    aria-orientation="vertical"
                >
                    {languages.map((language) => (
                        <li
                            key={language.code}
                            role="option"
                            aria-selected={currentLanguage.code === language.code}
                            className={`
                                flex items-center justify-between px-4 py-2 
                                hover:bg-gray-100 cursor-pointer 
                                ${currentLanguage.code === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                            `}
                            onClick={() => changeLanguage(language.code)}
                        >
                            <div className="flex items-center space-x-2">
                                <span>{language.nativeName}</span>
                            </div>
                            {currentLanguage.code === language.code && (
                                <Check className="w-5 h-5 text-blue-600" />
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Dropdown overlay to close when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default LanguageSwitcher;