import { useEffect, useState } from 'react';

import {
    FaBook,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
} from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

import api from '../api/axios';

function Subjects() {

    const { t } = useTranslation();

    const [subjects, setSubjects] = useState([]);

    const [name, setName] = useState('');

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchSubjects = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await api.get('/subjects/');

            setSubjects(response.data);

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
        fetchSubjects();
    }, []);

    const resetForm = () => {

        setName('');
        setEditingId(null);

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError('');
            setSuccess('');

            if (editingId) {

                await api.put(
                    `/subjects/${editingId}/`,
                    { name }
                );

                setSuccess(
                    t('subjectUpdated')
                );

            } else {

                await api.post(
                    '/subjects/',
                    { name }
                );

                setSuccess(
                    t('subjectCreated')
                );

            }

            resetForm();

            await fetchSubjects();

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                t('failedToSave')
            );

        } finally {

            setSaving(false);

        }
    };

    const handleEdit = (subject) => {

        setEditingId(subject.id);
        setName(subject.name);

    };

    const handleDelete = async (id) => {

        if (!window.confirm(t('deleteConfirmation'))) {
            return;
        }

        try {

            setError('');
            setSuccess('');

            await api.delete(
                `/subjects/${id}/`
            );

            setSuccess(
                t('subjectDeleted')
            );

            await fetchSubjects();

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
                    <FaBook />
                </div>

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        {t('subjects')}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {t('subjectsList')}
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
                            ? t('editSubject')
                            : t('addSubject')
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
                    className="flex flex-col gap-4 sm:flex-row"
                >

                    <input
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder={t('name')}
                        required
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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

                    <table className="w-full min-w-125">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-start text-sm font-semibold text-gray-600">
                                    {t('name')}
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
                                        colSpan="2"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('loading')}
                                    </td>
                                </tr>

                            ) : subjects.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="2"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {t('noSubjects')}
                                    </td>
                                </tr>

                            ) : (

                                subjects.map((subject) => (

                                    <tr
                                        key={subject.id}
                                        className="border-t border-gray-100"
                                    >

                                        <td className="px-5 py-4 text-sm text-gray-800">
                                            {subject.name}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(subject)
                                                    }
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            subject.id
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

export default Subjects;

