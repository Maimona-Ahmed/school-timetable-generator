import {
    useState
} from 'react';

import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    FaUser,
    FaLock,
    FaSchool,
    FaUserPlus,
} from 'react-icons/fa';

import {
    useAuth
} from '../context/AuthContext';


function Register() {

    const {
        registerUser
    } = useAuth();

    const navigate =
        useNavigate();


    const [username, setUsername] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [schoolName, setSchoolName] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError('');
        setLoading(true);


        try {

            await registerUser(
                username,
                password,
                schoolName
            );

            navigate('/');

        } catch (error) {

            const data =
                error.response?.data;


            if (
                data &&
                typeof data === 'object'
            ) {

                const messages =
                    Object.values(data)
                        .flat();

                setError(
                    messages.join(' ')
                );

            } else {

                setError(
                    'Failed to create account.'
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">

                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                        <FaUserPlus className="text-2xl" />

                    </div>


                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        Create Account
                    </h1>


                    <p className="mt-2 text-sm text-gray-500">
                        Create your school account
                    </p>

                </div>


                {error && (

                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Name
                        </label>


                        <div className="relative">

                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />


                            <input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                required
                                autoComplete="username"
                                placeholder="Enter your name"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        </div>

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>


                        <div className="relative">

                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />


                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                required
                                minLength={6}
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        </div>


                        <p className="mt-1 text-xs text-gray-400">
                            Password must be at least 6 characters.
                        </p>

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            School Name
                        </label>


                        <div className="relative">

                            <FaSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />


                            <input
                                type="text"
                                value={schoolName}
                                onChange={(event) =>
                                    setSchoolName(
                                        event.target.value
                                    )
                                }
                                required
                                placeholder="Enter school name"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <FaUserPlus />

                        {loading
                            ? 'Creating Account...'
                            : 'Create Account'
                        }

                    </button>

                </form>


                <div className="mt-6 text-center text-sm text-gray-500">

                    <span>
                        Already have an account?
                    </span>


                    <Link
                        to="/login"
                        className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Register;
