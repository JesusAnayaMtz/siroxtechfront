import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Servicio de autenticación para login y registro
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

export const register = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Los errores de validación del backend suelen venir en 'message', que puede ser un array o string
            const message = error.response?.data?.message;
            if (Array.isArray(message)) {
                throw new Error(message.join(', '));
            }
            throw new Error(message || 'Error en el registro');
        }
        throw new Error('Error desconocido');
    }
};
