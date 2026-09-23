import { useEffect, useState } from 'react';

import {
    FaClock,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

import api from '../api/axios';

function TimeSlots() {

    const { t } = useTranslation();

    const [timeSlots, setTimeSlots] = useState([]);

    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const days = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
    ];

    const dayTranslations = {
        Saturday: 'saturday',
        Sunday: 'sunday',
        Monday: 'monday',
        Tuesday: 'tuesday',
        Wednesday: 'wednesday',
    };

    const fetchTimeSlots = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await api.get(
                '/scheduling/time-slots/'
            );

            setTimeSlots(response.data);

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
        fetchTimeSlots();
    }, []);

    const resetForm = () => {

        setDay('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError('');
            setSuccess('');

            if (endTime <= startTime) {

                setError(
                    t('endTimeMustBeLater')
                );

                return;
            }

            const data = {
                day,
                start_time: startTime,
                end_time: endTime,
            };

            if (editingId) {

                await api.put(
                    `/scheduling/time-slots/${editingId}/`,
                    data
                );

                setSuccess(
                    t('timeSlotUpdated')
                );

            } else {

                await api.post(
                    '/scheduling/time-slots/',
                    data
                );

                setSuccess(
                    t('timeSlotCreated')
                );

            }

            resetForm();

            await fetchTimeSlots();

        } catch (error) {

            const data = error.response?.data;

            if (
                data &&
                typeof data === 'object'
            ) {

                const messages = Object.values(data)
                    .flat();

                setError(
                    messages.join(' ') ||
                    t('failedToSave')
                );

            } else {

                setError(t('failedToSave'));

            }

        } finally {

            setSaving(false);

        }
    };

    const handleEdit = (timeSlot) => {

        setEditingId(timeSlot.id);
        setDay(timeSlot.day);
        setStartTime(
            timeSlot.start_time.slice(0, 5)
        );
        setEndTime(
            timeSlot.end_time.slice(0, 5)
        );

    };

    const handleDelete = async (id) => {

        if (!window.confirm(t('deleteConfirmation'))) {
            return;
        }

        try {

            setError('');
            setSuccess('');

            await api.delete(
                `/scheduling/time-slots/${id}/`
            );

            setSuccess(
                t('timeSlotDeleted')
            );

            await fetchTimeSlots();

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                t('failedToDelete')
            );

        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">

                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <FaClock />
                </div>

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        {t('timeSlots')}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {t('timeSlotsList')}
                    </p>

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

            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-lg font-bold text-gray-800">
                        {editingId
                            ? t('editTimeSlot')
                            : t('addTimeSlot')
                        }
                    </h2>

                    {editingId && (
                        <button
                            onClick={resetForm}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                            <FaTimes />
                        </button>
                    )}

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >

                    <select
                        value={day}
                        onChange={(event) =>
                            setDay(event.target.value)
                        }
                        required
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="">
                            {t('selectDay')}
                        </option>

                        {days.map((item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {t(dayTranslations[item])}
                            </option>

                        ))}

                    </select>

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {t('startTime')}
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                                setStartTime(
                                    event.target.value
                                )
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {t('endTime')}
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(event) =>
                                setEndTime(
                                    event.target.value
                                )
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />

                    </div>

                    <div className="flex items-end">

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >

                            {editingId
                                ? <FaEdit />
                                : <FaPlus />
                            }

                            {saving
                                ? t('saving')
                                : editingId
                                    ? t('update')
                                    : t('add')
                            }

                        </button>

                    </div>

                </form>

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-125">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('day')}
                                </th>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('startTime')}
                                </th>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('endTime')}
                                </th>

                                <th className="px-5 py-4 text-center text-sm font-semibold text-gray-600">
                                    {t('actions')}
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('loading')}
                                    </td>
                                </tr>

                            ) : timeSlots.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('noTimeSlots')}
                                    </td>
                                </tr>

                            ) : (

                                timeSlots.map((timeSlot) => (

                                    <tr
                                        key={timeSlot.id}
                                        className="border-t border-gray-100"
                                    >

                                        <td className="px-5 py-4 text-sm text-gray-800">
                                            {t(
                                                dayTranslations[
                                                    timeSlot.day
                                                ]
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {timeSlot.start_time.slice(0, 5)}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {timeSlot.end_time.slice(0, 5)}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            timeSlot
                                                        )
                                                    }
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            timeSlot.id
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default TimeSlots;
