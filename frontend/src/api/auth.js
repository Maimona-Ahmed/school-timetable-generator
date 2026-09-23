import api from './axios';


export const login = async (
    username,
    password
) => {

    await api.get(
        '/auth/csrf/'
    );

    return api.post(
        '/auth/login/',
        {
            username,
            password,
        }
    );

};


export const register = async (
    username,
    password,
    schoolName
) => {

    await api.get(
        '/auth/csrf/'
    );

    return api.post(
        '/auth/register/',
        {
            username,
            password,
            school_name:
                schoolName,
        }
    );

};


export const logout = () => {

    return api.post(
        '/auth/logout/'
    );

};


export const getMe = () => {

    return api.get(
        '/auth/me/'
    );

};
