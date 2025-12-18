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

    // PATCH /products/:id
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

    // DELETE /products/:id
    remove: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    // PATCH /products/restore/:id
    restoreProduct: async (id: string): Promise<void> => {
        await api.patch(`/products/restore/${id}`);
    }
};
