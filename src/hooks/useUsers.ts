import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "@/services/usersService"
import type { CreateUserDto, User } from "@/types/user"
import { showSuccess, showError } from "@/lib/sweetalert"

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: usersService.findAll,
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateUserDto) => usersService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            showSuccess("Usuario creado exitosamente")
        },
        onError: (error) => {
            showError("Error al crear usuario")
            console.error(error)
        },
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
            usersService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            showSuccess("Usuario actualizado exitosamente")
        },
        onError: (error) => {
            showError("Error al actualizar usuario")
            console.error(error)
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => usersService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            showSuccess("Usuario eliminado exitosamente")
        },
        onError: (error) => {
            showError("Error al eliminar usuario")
            console.error(error)
        },
    })
}
