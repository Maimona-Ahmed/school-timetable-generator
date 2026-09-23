import { useTranslation } from 'react-i18next';

import {
    FaBars,
    FaSignOutAlt,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function Navbar({ setIsOpen }) {

    const {
        user,
        logoutUser,
    } = useAuth();

    const {
        t,
        i18n,
    } = useTranslation();

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            await logoutUser();
        } finally {
            navigate('/login');
        }
    };

    const changeLanguage = (language) => {

        i18n.changeLanguage(language);

        localStorage.setItem(
            'language',
            language
        );
    };

    return (
        <header className="fixed top-0 right-0 left-0 z-30 h-16 border-b border-gray-200 bg-white lg:left-64">

            <div className="flex h-full items-center justify-between px-4 sm:px-6">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                    >
                        <FaBars />
                    </button>

                    <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                        {t('timetable')}
                    </h2>

                </div>

                <div className="flex items-center gap-2 sm:gap-4">

                    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">

                        <button
                            onClick={() => changeLanguage('en')}
                            className={`
                                rounded-md px-3 py-1.5 text-xs font-medium
                                ${
                                    i18n.language === 'en'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500'
                                }
                            `}
                        >
                            EN
                        </button>

                        <button
                            onClick={() => changeLanguage('ar')}
                            className={`
                                rounded-md px-3 py-1.5 text-xs font-medium
                                ${
                                    i18n.language === 'ar'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500'
                                }
                            `}
                        >
                            AR
                        </button>

                    </div>

                    <div className="hidden text-right sm:block">

                        <p className="text-sm font-semibold text-gray-800">
                            {user?.username}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user?.school?.name}
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:px-4"
                    >
                        <FaSignOutAlt />
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Navbar;

