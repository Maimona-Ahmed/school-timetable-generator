import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Classes from './Pages/Classes';
import Teachers from './Pages/Teachers';
import Subjects from './Pages/Subjects';
import Assignments from './Pages/Assignments';
import Timetable from './Pages/Timetable';
import TimeSlots from './Pages/TimeSlots';

import Layout from './components/Layout';
import Register from './Pages/Register';


function App() {

    const { i18n } = useTranslation();

    useEffect(() => {

        const isArabic =
            i18n.language === 'ar';

        document.documentElement.dir =
            isArabic ? 'rtl' : 'ltr';

        document.documentElement.lang =
            isArabic ? 'ar' : 'en';

    }, [i18n.language]);




    const {
        loading,
        isAuthenticated,
    } = useAuth();


    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center">

                <p className="text-gray-600">
                    Loading...
                </p>

            </div>
        );
    }


    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/login"
                    element={
                        isAuthenticated
                            ? <Navigate to="/" replace />
                            : <Login />
                    }
                />
                <Route
                    path="/register"
                    element={
                        isAuthenticated
                            ? <Navigate
                                to="/"
                                replace
                            />
                            : <Register />
                    }
                />



                {/* Protected Routes */}

                {isAuthenticated && (

                    <Route
                        path="/"
                        element={<Layout />}
                    >

                        <Route
                            index
                            element={<Dashboard />}
                        />

                        <Route
                            path="classes"
                            element={<Classes />}
                        />

                        <Route
                            path="teachers"
                            element={<Teachers />}
                        />

                        <Route
                            path="subjects"
                            element={<Subjects />}
                        />
                        <Route
                            path="time-slots"
                            element={<TimeSlots />}
                        />


                        <Route
                            path="assignments"
                            element={<Assignments />}
                        />

                        <Route
                            path="timetable"
                            element={<Timetable />}
                        />

                    </Route>

                )}


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                isAuthenticated
                                    ? "/"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;

