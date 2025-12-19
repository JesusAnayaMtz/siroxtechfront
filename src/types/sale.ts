export interface SaleItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Sale {
    id: string;
    userId: string;
    clientId?: string | null;
    total: number;
    canceled: boolean;
    createdAt: string;
    items: SaleItem[];
}

export interface CreateSaleDto {
    clientId?: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}
