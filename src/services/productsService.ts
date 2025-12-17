import api from '@/lib/axios';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types/product';

export const productsService = {
    // GET /products
    findAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    // GET /products/:id
    findOne: async (id: string): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    // POST /products
    create: async (data: CreateProductDto): Promise<Product> => {
        // Ensure numbers are numbers, not strings from inputs
        const payload = {
            ...data,
            price: Number(data.price),
        };
        const response = await api.post<Product>('/products', payload);
        return response.data;
    },

    // PATCH /products/:id
    update: async (id: string, data: UpdateProductDto): Promise<Product> => {
        const payload = {
            ...data,
            price: data.price ? Number(data.price) : undefined,
        };
        const response = await api.patch<Product>(`/products/${id}`, payload);
        return response.data;
    },

    // DELETE /products/:id
    remove: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    // PATCH /products/restore/:id
    restoreProduct: async (id: string): Promise<void> => {
        await api.patch(`/products/restore/${id}`);
    }
};
