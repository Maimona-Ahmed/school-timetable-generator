import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {

    const csrfCookie = document.cookie
        .split(';')
        .find(
            cookie =>
                cookie.trim().startsWith('csrftoken=')
        );

    if (csrfCookie) {
        const csrfToken = csrfCookie.split('=')[1];

        config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
});

export default api;
