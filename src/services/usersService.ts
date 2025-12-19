import api from '@/lib/axios';
import type { User } from '@/types/user';

// Servicio encargado de las peticiones relacionadas con la gestión de usuarios
export const usersService = {
    // Obtiene el listado completo de usuarios del sistema
    findAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    // Busca un usuario específico por su ID
    findOne: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    // Actualiza los datos de un usuario existente
    update: async (id: string, data: Partial<User> | any): Promise<User> => {
        const response = await api.patch<User>(`/users/${id}`, data);
        return response.data;
    }
};
