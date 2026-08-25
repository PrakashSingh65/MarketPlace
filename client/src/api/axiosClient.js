import axios from "axios"

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
    baseURL: `${VITE_API_URL}/api/v1`,
    withCredentials: true,
})