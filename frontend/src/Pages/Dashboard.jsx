import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import {
    useTranslation,
} from 'react-i18next';

import {
    FaChalkboardTeacher,
    FaBook,
    FaUsers,
    FaClock,
    FaClipboardList,
    FaCalendarAlt,
    FaArrowRight,
} from 'react-icons/fa';

import api from '../api/axios';


function Dashboard() {

    const { t } =
        useTranslation();


    const [data, setData] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState('');


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response =
                    await api.get(
                        '/dashboard/'
                    );

                setData(
                    response.data
                );

            } catch (error) {

                setError(
                    error.response?.data?.detail ||
                    'Failed to load dashboard.'
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    if (loading) {

        return (

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-gray-500">
                    {t('loading')}
                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">

                {error}

            </div>

        );

    }


    const statistics =
        data?.statistics || {};


    const cards = [

        {
            title:
                t('teachers'),

            value:
                statistics.teachers || 0,

            icon:
                FaChalkboardTeacher,

            link:
                '/teachers',

            className:
                'bg-blue-100 text-blue-600',
        },

        {
            title:
                t('subjects'),

            value:
                statistics.subjects || 0,

            icon:
                FaBook,

            link:
                '/subjects',

            className:
                'bg-blue-100 text-blue-600',
        },

        {
            title:
                t('classes'),

            value:
                statistics.classes || 0,

            icon:
                FaUsers,

            link:
                '/classes',

            className:
                'bg-blue-100 text-blue-600',
        },

        {
            title:
                t('assignments'),

            value:
                statistics.assignments || 0,

            icon:
                FaClipboardList,

            link:
                '/assignments',

            className:
                'bg-blue-100 text-blue-600',
        },

        {
            title:
                t('time_slots'),

            value:
                statistics.time_slots || 0,

            icon:
                FaClock,

            link:
                '/time-slots',

            className:
                'bg-blue-100 text-blue-600',
        },

        {
            title:
                t('timetable'),

            value:
                statistics.timetable_slots || 0,

            icon:
                FaCalendarAlt,

            link:
                '/timetable',

            className:
                'bg-blue-100 text-blue-600',
        },

    ];


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    {t('dashboard')}
                </h1>


                <p className="mt-1 text-sm text-gray-500">
                    {data.school.name}
                </p>

            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {cards.map((card) => {

                    const Icon =
                        card.icon;


                    return (

                        <Link
                            key={card.title}
                            to={card.link}
                            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>


                                    <p className="mt-2 text-3xl font-bold text-gray-800">
                                        {card.value}
                                    </p>

                                </div>


                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.className}`}
                                >

                                    <Icon className="text-xl" />

                                </div>

                            </div>


                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">

                                <span>
                                    {t('view_details')}
                                </span>


                                <FaArrowRight className="text-xs transition group-hover:translate-x-1" />

                            </div>

                        </Link>

                    );

                })}

            </div>


            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-gray-800">
                            {t('timetable_generation')}
                        </h2>


                        <p className="mt-1 text-sm text-gray-500">
                            {t('timetable_generation_description')}
                        </p>

                    </div>


                    <Link
                        to="/timetable"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >

                        <FaCalendarAlt />

                        {t('generate_timetable')}

                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Dashboard;
