import { useState } from "react"
import type { Client, CreateClientDto } from "@/types/client"
import { ClientsTable } from "@/components/clientes/ClientsTable"
import { ClientForm } from "@/components/clientes/ClientForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
    useClients,
    useCreateClient,
    useUpdateClient,
    useDeleteClient,
    useRestoreClient
} from "@/hooks/useClients"
import { showConfirm } from "@/lib/sweetalert"
import { Pagination } from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10

export default function ClientsPage() {
    const { data: clients = [], isLoading: isLoadingClients } = useClients()

    const createMutation = useCreateClient()
    const updateMutation = useUpdateClient()
    const deleteMutation = useDeleteClient()
    const restoreMutation = useRestoreClient()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [isReadOnly, setIsReadOnly] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const isLoading = isLoadingClients ||
        createMutation.isPending || updateMutation.isPending ||
        deleteMutation.isPending || restoreMutation.isPending

    const handleCreate = () => {
        setSelectedClient(null)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleEdit = (client: Client) => {
        setSelectedClient(client)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleView = (client: Client) => {
        setSelectedClient(client)
        setIsReadOnly(true)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        const confirmed = await showConfirm("¿Desactivar Cliente?", "¿Estás seguro de que quieres desactivar este cliente?", "Sí, desactivar")
        if (!confirmed) return
        try {
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to delete client", error)
        }
    }

    const handleRestore = async (id: string) => {
        const confirmed = await showConfirm("¿Restaurar Cliente?", "¿Estás seguro de que quieres restaurar este cliente?", "Sí, restaurar")
        if (!confirmed) return
        try {
            await restoreMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to restore client", error)
        }
    }

    const handleSubmit = async (values: CreateClientDto) => {
        try {
            if (selectedClient) {
                // Remove email from payload if it hasn't changed to avoid unique constraint error
                const { email, ...rest } = values
                const dataToUpdate: any = { ...rest }

                if (email !== selectedClient.email) {
                    dataToUpdate.email = email
                }

                await updateMutation.mutateAsync({ id: selectedClient.id, data: dataToUpdate })
            } else {
                await createMutation.mutateAsync(values)
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to save client", error)
            throw error // Re-throw to prevent form reset
        }
    }

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
                    <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nuevo Cliente
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Cargando clientes...</div>
            ) : (
                <>
                    <ClientsTable
                        data={filteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        onView={handleView}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredClients.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <ClientForm
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedClient}
                isLoading={isLoading}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
