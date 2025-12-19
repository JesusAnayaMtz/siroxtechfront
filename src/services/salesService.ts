import api from '@/lib/axios';
import type { Sale, CreateSaleDto } from '@/types/sale';

// Servicio encargado de procesar las ventas
export const salesService = {
    // Obtiene el historial completo de ventas
    findAll: async (): Promise<Sale[]> => {
        const response = await api.get<Sale[]>('/sales');
        return response.data;
    },

    // Obtiene el detalle de una venta específica
    findOne: async (id: string): Promise<Sale> => {
        const response = await api.get<Sale>(`/sales/${id}`);
        return response.data;
    },

    // Registra una nueva venta en el sistema
    create: async (data: CreateSaleDto): Promise<Sale> => {
        const response = await api.post<Sale>('/sales', data);
        return response.data;
    },

    // Cancela una venta realizada
    remove: async (id: string): Promise<void> => {
        await api.delete(`/sales/${id}`);
    }
};
