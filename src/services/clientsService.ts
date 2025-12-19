import api from '@/lib/axios';
import type { Client, CreateClientDto, UpdateClientDto } from '@/types/client';

export const clientsService = {
    findAll: async (): Promise<Client[]> => {
        const response = await api.get<Client[]>('/clients');
        return response.data;
    },

    findOne: async (id: string): Promise<Client> => {
        const response = await api.get<Client>(`/clients/${id}`);
        return response.data;
    },

    create: async (data: CreateClientDto): Promise<Client> => {
        const response = await api.post<Client>('/clients', data);
        return response.data;
    },

    update: async (id: string, data: UpdateClientDto): Promise<Client> => {
        const response = await api.patch<Client>(`/clients/${id}`, data);
        return response.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/clients/${id}`);
    },

    restore: async (id: string): Promise<void> => {
        await api.patch(`/clients/restore/${id}`);
    }
};
