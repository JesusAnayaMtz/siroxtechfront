export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClientDto {
    name: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> { }
