import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    FaTachometerAlt,
    FaSchool,
    FaUsers,
    FaBook,
    FaClipboardList,
    FaClock,
    FaCalendarAlt,
    FaTimes,
} from 'react-icons/fa';

function Sidebar({ isOpen, setIsOpen }) {

    const { t } = useTranslation();

    const linkClass = ({ isActive }) => `
        flex items-center gap-3 rounded-lg px-4 py-3
        transition
        ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }
    `;

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-64 bg-slate-900 text-white
                    transform transition-transform duration-300
                    ${
                        isOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }
                    lg:translate-x-0
                `}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">

                    <h1 className="text-xl font-bold">
                        {t('appName')}
                    </h1>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
                    >
                        <FaTimes />
                    </button>

                </div>

                <nav className="space-y-2 p-4">

                    <NavLink
                        to="/"
                        end
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaTachometerAlt />
                        <span>{t('dashboard')}</span>
                    </NavLink>

                    <NavLink
                        to="/classes"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaSchool />
                        <span>{t('classes')}</span>
                    </NavLink>

                    <NavLink
                        to="/teachers"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaUsers />
                        <span>{t('teachers')}</span>
                    </NavLink>

                    <NavLink
                        to="/subjects"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaBook />
                        <span>{t('subjects')}</span>
                    </NavLink>

                    <NavLink
                        to="/assignments"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaClipboardList />
                        <span>{t('assignments')}</span>
                    </NavLink>

                    <NavLink
                        to="/time-slots"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaClock />
                        <span>{t('timeSlots')}</span>
                    </NavLink>

                    <NavLink
                        to="/timetable"
                        onClick={handleLinkClick}
                        className={linkClass}
                    >
                        <FaCalendarAlt />
                        <span>{t('timetable')}</span>
                    </NavLink>

                </nav>
            </aside>
        </>
    );
}

export default Sidebar;

