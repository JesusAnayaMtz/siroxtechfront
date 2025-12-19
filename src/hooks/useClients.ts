import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clientsService";
import type { CreateClientDto, UpdateClientDto } from "@/types/client";

export const useClients = () => {
    return useQuery({
        queryKey: ["clients"],
        queryFn: clientsService.findAll,
    });
};

export const useClient = (id: string) => {
    return useQuery({
        queryKey: ["clients", id],
        queryFn: () => clientsService.findOne(id),
        enabled: !!id,
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClientDto) => clientsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
            clientsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
};

export const useRestoreClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientsService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
};
