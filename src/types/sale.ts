export interface SaleItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Sale {
    id: string;
    userId: string;
    total: number;
    canceled: boolean;
    createdAt: string;
    items: SaleItem[];
}

export interface CreateSaleDto {
    items: {
        productId: string;
        quantity: number;
    }[];
}
