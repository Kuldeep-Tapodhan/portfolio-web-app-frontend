import api from './api';

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/login/', { username, password });
        // The backend returns: { code: "LOGIN_SUCCESS", data: { access, refresh, ... } }
        if (response.data.data.access) {
            localStorage.setItem("access", response.data.data.access);
            localStorage.setItem("refresh", response.data.data.refresh);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const logoutUser = () => {
    // We remove tokens from local storage immediately
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};