import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateProductDto, UpdateProductDto } from '@/types/product'
import { productsService } from '@/services/productsService'

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: productsService.findAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateProductDto) => productsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
            productsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => productsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export const useRestoreProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => productsService.restoreProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}
