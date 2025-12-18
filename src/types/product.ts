export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    categoryName?: string;
    category?: { name: string }; // Optional relation for display
    imageUrl?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    file?: File | null;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'file'>> {
    file?: File | null;
}
