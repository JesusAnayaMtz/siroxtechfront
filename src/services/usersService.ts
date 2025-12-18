import api from '@/lib/axios';
import type { User } from '@/types/user';

export const usersService = {
    findAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users'); // Assuming standard endpoint, checking authService if unsure
        return response.data;
    },

    findOne: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    }
};
