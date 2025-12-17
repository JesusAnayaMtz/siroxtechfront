export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    categoryName?: string;
    category?: { name: string }; // Optional relation for display
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }
