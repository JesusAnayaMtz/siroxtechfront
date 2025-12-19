import api from '@/lib/axios';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types/product';

// Servicio para la gestión de productos (CRUD y restauración)
export const productsService = {
    // Obtiene la lista completa de productos activos e inactivos
    findAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    // Busca un producto específico por su identificador
    findOne: async (id: string): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    // Crea un nuevo producto con imagen opcional
    create: async (data: CreateProductDto): Promise<Product> => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('categoryId', data.categoryId);
        if (data.description) formData.append('description', data.description);
        if (data.file) formData.append('file', data.file);

        const response = await api.post<Product>('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Actualiza los datos de un producto existente
    update: async (id: string, data: UpdateProductDto): Promise<Product> => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.price !== undefined) formData.append('price', String(data.price));
        if (data.categoryId) formData.append('categoryId', data.categoryId);
        if (data.description) formData.append('description', data.description);
        if (data.file) formData.append('file', data.file);

        const response = await api.patch<Product>(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Desactiva (soft delete) un producto
    remove: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    // Restaura un producto previamente desactivado
    restoreProduct: async (id: string): Promise<void> => {
        await api.patch(`/products/restore/${id}`);
    }
};
