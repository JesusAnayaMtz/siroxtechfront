import { useState } from "react"
import type { User, CreateUserDto } from "@/types/user"
import { UsersTable } from "@/components/usuarios/UsersTable"
import { UserForm } from "@/components/usuarios/UserForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
    useUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
} from "@/hooks/useUsers"
import { showConfirm } from "@/lib/sweetalert"
import { Pagination } from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
    const { data: users = [], isLoading: isLoadingUsers } = useUsers()

    const createMutation = useCreateUser()
    const updateMutation = useUpdateUser()
    const deleteMutation = useDeleteUser()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isReadOnly, setIsReadOnly] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const isLoading = isLoadingUsers ||
        createMutation.isPending || updateMutation.isPending ||
        deleteMutation.isPending

    const handleCreate = () => {
        setSelectedUser(null)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleView = (user: User) => {
        setSelectedUser(user)
        setIsReadOnly(true)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        const confirmed = await showConfirm("¿Eliminar Usuario?", "¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.", "Sí, eliminar")
        if (!confirmed) return
        try {
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to delete user", error)
        }
    }

    const handleSubmit = async (values: CreateUserDto) => {
        try {
            if (selectedUser) {
                // Remove email from payload if it hasn't changed to avoid unique constraint error
                const { email, ...rest } = values
                const dataToUpdate: any = { ...rest }

                if (email !== selectedUser.email) {
                    dataToUpdate.email = email
                }

                // If password is empty (it was optional in edit), remove it?
                // The form handles this mostly, but good to double check.
                // Actually the form deletes the password key if empty on edit.

                await updateMutation.mutateAsync({ id: selectedUser.id, data: dataToUpdate })
            } else {
                await createMutation.mutateAsync(values)
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to save user", error)
            throw error // Re-throw to prevent form reset
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
                    <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nuevo Usuario
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
                <div className="text-center text-muted-foreground py-8">Cargando usuarios...</div>
            ) : (
                <>
                    <UsersTable
                        data={filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <UserForm
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedUser}
                isLoading={isLoading}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
