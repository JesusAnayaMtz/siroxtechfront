import api from '@/lib/axios';
import type { Sale, CreateSaleDto } from '@/types/sale';

export const salesService = {
    findAll: async (): Promise<Sale[]> => {
        const response = await api.get<Sale[]>('/sales');
        return response.data;
    },

    findOne: async (id: string): Promise<Sale> => {
        const response = await api.get<Sale>(`/sales/${id}`);
        return response.data;
    },

    create: async (data: CreateSaleDto): Promise<Sale> => {
        const response = await api.post<Sale>('/sales', data);
        return response.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/sales/${id}`);
    }
};
