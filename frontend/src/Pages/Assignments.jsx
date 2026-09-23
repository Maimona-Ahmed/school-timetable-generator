import { useEffect, useState } from 'react';

import {
    FaClipboardList,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

import api from '../api/axios';

function Assignments() {

    const { t } = useTranslation();

    const [assignments, setAssignments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);

    const [teacher, setTeacher] = useState('');
    const [subject, setSubject] = useState('');
    const [schoolClass, setSchoolClass] = useState('');
    const [weeklyLessons, setWeeklyLessons] = useState('');

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {

        try {

            setLoading(true);
            setError('');

            const [
                assignmentsResponse,
                teachersResponse,
                subjectsResponse,
                classesResponse,
            ] = await Promise.all([
                api.get('/assignments/'),
                api.get('/teachers/'),
                api.get('/subjects/'),
                api.get('/classes/'),
            ]);

            setAssignments(
                assignmentsResponse.data
            );

            setTeachers(
                teachersResponse.data
            );

            setSubjects(
                subjectsResponse.data
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

    const resetForm = () => {

        setTeacher('');
        setSubject('');
        setSchoolClass('');
        setWeeklyLessons('');
        setEditingId(null);

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError('');
            setSuccess('');

            const data = {
                teacher: Number(teacher),
                subject: Number(subject),
                school_class: Number(schoolClass),
                weekly_lessons: Number(weeklyLessons),
            };

            if (editingId) {

                await api.put(
                    `/assignments/${editingId}/`,
                    data
                );

                setSuccess(
                    t('assignmentUpdated')
                );

            } else {

                await api.post(
                    '/assignments/',
                    data
                );

                setSuccess(
                    t('assignmentCreated')
                );

            }

            resetForm();

            await fetchData();

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

    const handleEdit = (assignment) => {

        setEditingId(assignment.id);

        setTeacher(
            String(assignment.teacher)
        );

        setSubject(
            String(assignment.subject)
        );

        setSchoolClass(
            String(assignment.school_class)
        );

        setWeeklyLessons(
            String(assignment.weekly_lessons)
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
                `/assignments/${id}/`
            );

            setSuccess(
                t('assignmentDeleted')
            );

            await fetchData();

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                t('failedToDelete')
            );

        }
    };

    const getTeacherName = (id) => {

        return teachers.find(
            teacher =>
                teacher.id === id
        )?.name || '-';

    };

    const getSubjectName = (id) => {

        return subjects.find(
            subject =>
                subject.id === id
        )?.name || '-';

    };

    const getClassName = (id) => {

        return classes.find(
            schoolClass =>
                schoolClass.id === id
        )?.name || '-';

    };

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">

                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <FaClipboardList />
                </div>

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        {t('assignments')}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {t('assignmentsList')}
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
                            ? t('editAssignment')
                            : t('addAssignment')
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
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
                >

                    <select
                        value={teacher}
                        onChange={(event) =>
                            setTeacher(event.target.value)
                        }
                        required
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="">
                            {t('selectTeacher')}
                        </option>

                        {teachers.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}

                    </select>

                    <select
                        value={subject}
                        onChange={(event) =>
                            setSubject(event.target.value)
                        }
                        required
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="">
                            {t('selectSubject')}
                        </option>

                        {subjects.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}

                    </select>

                    <select
                        value={schoolClass}
                        onChange={(event) =>
                            setSchoolClass(event.target.value)
                        }
                        required
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="">
                            {t('selectClass')}
                        </option>

                        {classes.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}

                    </select>

                    <input
                        type="number"
                        min="1"
                        value={weeklyLessons}
                        onChange={(event) =>
                            setWeeklyLessons(
                                event.target.value
                            )
                        }
                        placeholder={t('weeklyLessons')}
                        required
                        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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

                </form>

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-225">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('teacher')}
                                </th>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('subject')}
                                </th>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('schoolClass')}
                                </th>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('weeklyLessons')}
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
                                        colSpan="5"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('loading')}
                                    </td>
                                </tr>

                            ) : assignments.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('noAssignments')}
                                    </td>
                                </tr>

                            ) : (

                                assignments.map((assignment) => (

                                    <tr
                                        key={assignment.id}
                                        className="border-t border-gray-100"
                                    >

                                        <td className="px-5 py-4 text-sm text-gray-800">
                                            {getTeacherName(
                                                assignment.teacher
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-800">
                                            {getSubjectName(
                                                assignment.subject
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-800">
                                            {getClassName(
                                                assignment.school_class
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {assignment.weekly_lessons}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            assignment
                                                        )
                                                    }
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            assignment.id
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

export default Assignments;
