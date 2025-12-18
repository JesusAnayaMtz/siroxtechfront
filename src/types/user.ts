export interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    isActive?: boolean;
}

export interface UpdateUserDto {
    name?: string;
    password?: string;
}
