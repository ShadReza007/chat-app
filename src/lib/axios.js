import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-api-izbd.onrender.com/api",
    withCredentials: true,
});