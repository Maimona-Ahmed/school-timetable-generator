import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    login,
    logout,
    getMe,
    register,
} from '../api/auth';


const AuthContext =
    createContext(null);


export function AuthProvider({
    children
}) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    const isAuthenticated =
        user !== null;


    const checkAuth = async () => {

        try {

            const response =
                await getMe();

            setUser(
                response.data
            );

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }

    };


    const loginUser = async (
        username,
        password
    ) => {

        const response =
            await login(
                username,
                password
            );

        setUser(
            response.data.user
        );

        return response.data;

    };


    const registerUser = async (
        username,
        password,
        schoolName
    ) => {

        const response =
            await register(
                username,
                password,
                schoolName
            );

        setUser(
            response.data.user
        );

        return response.data;

    };


    const logoutUser = async () => {

        try {

            await logout();

        } finally {

            setUser(null);

        }

    };


    useEffect(() => {

        checkAuth();

    }, []);


    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                loginUser,
                registerUser,
                logoutUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    return useContext(
        AuthContext
    );

}
