import { useEffect, useMemo, useState } from 'react';

import {
    FaCalendarAlt,
    FaSyncAlt,
    FaFilter,
    FaClock,
    FaFilePdf,
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

import api from '../api/axios';


function Timetable() {

    const { t, i18n } = useTranslation();

    const [timetable, setTimetable] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedClass, setSelectedClass] = useState('all');

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const dayTranslations = {
        Saturday: 'saturday',
        Sunday: 'sunday',
        Monday: 'monday',
        Tuesday: 'tuesday',
        Wednesday: 'wednesday',
    };


    const fetchData = async () => {

        try {

            setLoading(true);
            setError('');

            const [
                timetableResponse,
                timeSlotsResponse,
                classesResponse,
            ] = await Promise.all([
                api.get('/scheduling/timetable/'),
                api.get('/scheduling/time-slots/'),
                api.get('/classes/'),
            ]);

            setTimetable(
                timetableResponse.data
            );

            setTimeSlots(
                timeSlotsResponse.data
            );

            setClasses(
                classesResponse.data
            );

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                t('failedToLoad')
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchData();

    }, []);


    const generateTimetable = async () => {

        try {

            setGenerating(true);
            setError('');
            setSuccess('');

            const response = await api.post(
                '/scheduling/generate/'
            );

            setSuccess(
                response.data?.detail ||
                t('timetableGenerated')
            );

            await fetchData();

        } catch (error) {

            const responseData =
                error.response?.data;

            if (
                responseData &&
                typeof responseData === 'object'
            ) {

                const messages =
                    Object.values(
                        responseData
                    ).flat();

                setError(
                    messages.join(' ') ||
                    t('failedToGenerate')
                );

            } else {

                setError(
                    t('failedToGenerate')
                );

            }

        } finally {

            setGenerating(false);

        }

    };


    const orderedDays = useMemo(() => {

        const dayOrder = [
            'Saturday',
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
        ];

        return dayOrder.filter(
            day =>
                timeSlots.some(
                    timeSlot =>
                        timeSlot.day === day
                )
        );

    }, [timeSlots]);


    const orderedTimeSlots = useMemo(() => {

        const uniqueSlots = new Map();

        timeSlots.forEach((timeSlot) => {

            const key =
                `${timeSlot.start_time}-${timeSlot.end_time}`;

            if (!uniqueSlots.has(key)) {

                uniqueSlots.set(
                    key,
                    timeSlot
                );

            }

        });

        return [...uniqueSlots.values()].sort(
            (a, b) =>
                a.start_time.localeCompare(
                    b.start_time
                )
        );

    }, [timeSlots]);


    const classList = useMemo(() => {

        return [...classes].sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }, [classes]);


    const displayedClasses =
        selectedClass === 'all'
            ? classList
            : classList.filter(
                schoolClass =>
                    schoolClass.name ===
                    selectedClass
            );


    const getLesson = (
        className,
        day,
        timeSlot
    ) => {

        return timetable.find((item) => {

            return (
                item.school_class === className &&
                item.day === day &&
                item.start_time.slice(0, 5) ===
                    timeSlot.start_time.slice(0, 5) &&
                item.end_time.slice(0, 5) ===
                    timeSlot.end_time.slice(0, 5)
            );

        });

    };


    const formatTimeRange = (timeSlot) => {

        return `${timeSlot.start_time.slice(0, 5)} - ${timeSlot.end_time.slice(0, 5)}`;

    };


    const loadArabicFont = async (doc) => {

        const response = await fetch(
            '/fonts/NotoSansArabic-Regular.ttf'
        );

        if (!response.ok) {

            throw new Error(
                'Arabic font could not be loaded.'
            );

        }

        const buffer =
            await response.arrayBuffer();

        const bytes =
            new Uint8Array(buffer);

        let binary = '';

        const chunkSize = 0x8000;

        for (
            let i = 0;
            i < bytes.length;
            i += chunkSize
        ) {

            const chunk =
                bytes.subarray(
                    i,
                    Math.min(
                        i + chunkSize,
                        bytes.length
                    )
                );

            binary += String.fromCharCode(
                ...chunk
            );

        }

        const base64 =
            btoa(binary);

        doc.addFileToVFS(
            'NotoSansArabic-Regular.ttf',
            base64
        );

        doc.addFont(
            'NotoSansArabic-Regular.ttf',
            'NotoSansArabic',
            'normal'
        );

        doc.setFont(
            'NotoSansArabic'
        );

    };


    const preparePdfText = (text) => {

        if (
            text === null ||
            text === undefined
        ) {

            return '';

        }

        return String(text);

    };


    const exportPdf = async () => {

        try {

            setExporting(true);
            setError('');
            setSuccess('');

            if (
                displayedClasses.length === 0 ||
                orderedDays.length === 0 ||
                orderedTimeSlots.length === 0
            ) {

                setError(
                    t('noTimetable')
                );

                return;

            }


            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });


            const isArabic =
                i18n.language === 'ar';


            if (isArabic) {

                await loadArabicFont(doc);

            }


            const schoolName =
                t('appName');


            displayedClasses.forEach(
                (schoolClass, classIndex) => {

                    if (classIndex > 0) {

                        doc.addPage();

                    }


                    doc.setFontSize(18);

                    doc.text(
                        preparePdfText(
                            t('timetable')
                        ),
                        isArabic
                            ? 280
                            : 15,
                        15,
                        {
                            align:
                                isArabic
                                    ? 'right'
                                    : 'left',
                        }
                    );


                    doc.setFontSize(11);

                    doc.text(
                        preparePdfText(
                            schoolName
                        ),
                        isArabic
                            ? 280
                            : 15,
                        23,
                        {
                            align:
                                isArabic
                                    ? 'right'
                                    : 'left',
                        }
                    );


                    doc.text(
                        preparePdfText(
                            `${t('schoolClass')}: ${schoolClass.name}`
                        ),
                        isArabic
                            ? 280
                            : 15,
                        30,
                        {
                            align:
                                isArabic
                                    ? 'right'
                                    : 'left',
                        }
                    );


                    doc.text(
                        preparePdfText(
                            `${t('room')}: ${schoolClass.room}`
                        ),
                        isArabic
                            ? 280
                            : 15,
                        37,
                        {
                            align:
                                isArabic
                                    ? 'right'
                                    : 'left',
                        }
                    );


                    const headers =
                        isArabic
                            ? [
                                ...orderedTimeSlots
                                    .slice()
                                    .reverse()
                                    .map(
                                        timeSlot =>
                                            formatTimeRange(
                                                timeSlot
                                            )
                                    ),
                                t('day'),
                            ]
                            : [
                                t('day'),
                                ...orderedTimeSlots.map(
                                    timeSlot =>
                                        formatTimeRange(
                                            timeSlot
                                        )
                                ),
                            ];


                    const rows =
                        orderedDays.map(
                            day => {

                                const cells =
                                    orderedTimeSlots.map(
                                        timeSlot => {

                                            const lesson =
                                                getLesson(
                                                    schoolClass.name,
                                                    day,
                                                    timeSlot
                                                );


                                            if (lesson) {

                                                return `${preparePdfText(lesson.subject)}\n${preparePdfText(lesson.teacher)}\n${t('room')}: ${preparePdfText(lesson.room)}`;

                                            }


                                            return t('free');

                                        }
                                    );


                                if (isArabic) {

                                    return [
                                        ...cells.reverse(),
                                        t(
                                            dayTranslations[
                                                day
                                            ]
                                        ),
                                    ];

                                }


                                return [
                                    t(
                                        dayTranslations[
                                            day
                                        ]
                                    ),
                                    ...cells,
                                ];

                            }
                        );


                    autoTable(doc, {

                        head: [
                            headers
                        ],

                        body: rows,

                        startY: 45,

                        theme: 'grid',

                        styles: {

                            font:
                                isArabic
                                    ? 'NotoSansArabic'
                                    : 'helvetica',

                            fontStyle:
                                'normal',

                            fontSize: 8,

                            cellPadding: 3,

                            halign:
                                isArabic
                                    ? 'right'
                                    : 'center',

                            valign:
                                'middle',

                            overflow:
                                'linebreak',

                            lineWidth:
                                0.2,

                        },


                        headStyles: {

                            font:
                                isArabic
                                    ? 'NotoSansArabic'
                                    : 'helvetica',

                            fontStyle:
                                'normal',

                            fontSize: 8,

                            halign:
                                'center',

                            valign:
                                'middle',

                        },


                        bodyStyles: {

                            minCellHeight: 18,

                        },


                        columnStyles:
                            isArabic
                                ? {

                                    [orderedTimeSlots.length]:
                                        {
                                            cellWidth: 30,
                                            halign:
                                                'center',
                                        },

                                }
                                : {

                                    0:
                                        {
                                            cellWidth: 30,
                                            halign:
                                                'center',
                                        },

                                },


                        didParseCell:
                            (data) => {

                                if (isArabic) {

                                    data.cell.styles.font =
                                        'NotoSansArabic';

                                    data.cell.styles.halign =
                                        'right';

                                }

                            },

                    });

                }
            );


            const fileName =
                selectedClass === 'all'
                    ? 'school-timetable.pdf'
                    : `timetable-${selectedClass}.pdf`;


            doc.save(
                fileName
            );


            setSuccess(
                t('exportPdf')
            );


        } catch (error) {

            setError(
                error.message ||
                'Failed to export PDF.'
            );

        } finally {

            setExporting(false);

        }

    };


    if (loading) {

        return (

            <div className="flex min-h-100 items-center justify-center">

                <div className="text-center">

                    <FaCalendarAlt className="mx-auto text-4xl text-blue-500" />

                    <p className="mt-3 text-gray-500">
                        {t('loading')}
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="space-y-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">

                        <FaCalendarAlt />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                            {t('timetable')}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            {t('appName')}
                        </p>

                    </div>

                </div>


                <div className="flex flex-col gap-2 sm:flex-row">

                    <button
                        onClick={generateTimetable}
                        disabled={generating}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <FaSyncAlt
                            className={
                                generating
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                        {generating
                            ? t('generating')
                            : t('generateTimetable')
                        }

                    </button>


                    <button
                        onClick={exportPdf}
                        disabled={exporting}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <FaFilePdf />

                        {exporting
                            ? t('saving')
                            : t('exportPdf')
                        }

                    </button>

                </div>

            </div>


            {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {error}

                </div>

            )}


            {success && (

                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                    {success}

                </div>

            )}


            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2">

                        <FaFilter className="text-gray-500" />

                        <h2 className="font-semibold text-gray-800">
                            {t('filterByClass')}
                        </h2>

                    </div>


                    <div className="w-full sm:w-72">

                        <select
                            value={selectedClass}
                            onChange={(event) =>
                                setSelectedClass(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >

                            <option value="all">
                                {t('allClasses')}
                            </option>


                            {classList.map(
                                (schoolClass) => (

                                    <option
                                        key={schoolClass.id}
                                        value={schoolClass.name}
                                    >
                                        {schoolClass.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>

            </div>


            {displayedClasses.length === 0 ? (

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />

                    <p className="mt-3 font-medium text-gray-600">
                        {t('noClasses')}
                    </p>

                </div>

            ) : orderedDays.length === 0 ||
              orderedTimeSlots.length === 0 ? (

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    <FaClock className="mx-auto text-4xl text-gray-300" />

                    <p className="mt-3 font-medium text-gray-600">
                        {t('noTimeSlots')}
                    </p>

                </div>

            ) : (

                <div className="space-y-8">

                    {displayedClasses.map(
                        (schoolClass) => (

                            <div
                                key={schoolClass.id}
                                className="rounded-xl bg-white shadow-sm"
                            >

                                <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                                {schoolClass.name}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {t('room')}: {schoolClass.room}
                                            </p>

                                        </div>

                                        <FaCalendarAlt className="text-xl text-blue-500" />

                                    </div>

                                </div>


                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-237 border-collapse">

                                        <thead>

                                            <tr className="bg-gray-50">

                                                <th className="sticky left-0 z-10 w-36 border-b border-r border-gray-200 bg-gray-50 px-4 py-4 text-center text-sm font-semibold text-gray-600">

                                                    {t('day')}

                                                </th>


                                                {orderedTimeSlots.map(
                                                    (timeSlot) => (

                                                        <th
                                                            key={timeSlot.id}
                                                            className="border-b border-r border-gray-200 px-4 py-4 text-center text-sm font-semibold text-gray-600"
                                                        >

                                                            {formatTimeRange(
                                                                timeSlot
                                                            )}

                                                        </th>

                                                    )
                                                )}

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {orderedDays.map(
                                                (day) => (

                                                    <tr
                                                        key={day}
                                                    >

                                                        <td className="sticky left-0 z-10 border-b border-r border-gray-200 bg-white px-4 py-5 text-center text-sm font-semibold text-gray-700">

                                                            {t(
                                                                dayTranslations[
                                                                    day
                                                                ]
                                                            )}

                                                        </td>


                                                        {orderedTimeSlots.map(
                                                            (timeSlot) => {

                                                                const lesson =
                                                                    getLesson(
                                                                        schoolClass.name,
                                                                        day,
                                                                        timeSlot
                                                                    );


                                                                return (

                                                                    <td
                                                                        key={`${schoolClass.id}-${day}-${timeSlot.id}`}
                                                                        className="h-28 border-b border-r border-gray-200 p-2 align-top"
                                                                    >

                                                                        {lesson ? (

                                                                            <div className="h-full rounded-lg bg-blue-50 p-3">

                                                                                <p className="text-sm font-semibold text-blue-800">
                                                                                    {lesson.subject}
                                                                                </p>

                                                                                <p className="mt-2 text-xs text-gray-600">
                                                                                    {lesson.teacher}
                                                                                </p>

                                                                                <p className="mt-2 text-xs text-gray-400">
                                                                                    {t('room')}: {lesson.room}
                                                                                </p>

                                                                            </div>

                                                                        ) : (

                                                                            <div className="flex h-full items-center justify-center rounded-lg bg-gray-50">

                                                                                <span className="text-xs text-gray-300">
                                                                                    {t('free')}
                                                                                </span>

                                                                            </div>

                                                                        )}

                                                                    </td>

                                                                );

                                                            }
                                                        )}

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Timetable;
