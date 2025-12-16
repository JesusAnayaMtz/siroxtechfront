import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error en el login');
        }
        throw new Error('Error desconocido');
    }
};
