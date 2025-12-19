import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateCategoryDto } from '@/types/category'
import { categoriesService } from '@/services/categoriesService'

// Hooks personalizados para la gestión de categorías usando React Query
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoriesService.findAll,
        staleTime: 1000 * 60 * 60, // 1 hour (categories change less often)
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateCategoryDto }) =>
            categoriesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => categoriesService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export const useRestoreCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => categoriesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}
