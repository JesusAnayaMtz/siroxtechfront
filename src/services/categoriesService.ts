import api from '@/lib/axios';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';

// Servicio para gestionar las operaciones CRUD de categorías
export const categoriesService = {

    // Obtiene todas las categorías disponibles
    findAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },


    // Busca una categoría por su ID
    findOne: async (id: string): Promise<Category> => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },


    // Crea una nueva categoría
    create: async (data: CreateCategoryDto): Promise<Category> => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },


    // Actualiza el nombre de una categoría existente
    update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
        const response = await api.patch<Category>(`/categories/${id}`, data);
        return response.data;
    },


    // Elimina (soft delete) una categoría
    remove: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },

    // Restaura una categoría eliminada
    restore: async (id: string): Promise<void> => {
        await api.patch(`/categories/restore/${id}`);
    }
};
