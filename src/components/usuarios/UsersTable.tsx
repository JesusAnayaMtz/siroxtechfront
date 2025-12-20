import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye } from "lucide-react"
import type { User } from "@/types/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface UsersTableProps {
    data: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onView: (user: User) => void;
}

export function UsersTable({ data, onEdit, onDelete, onView }: UsersTableProps) {
    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Nombre</TableHead>
                        <TableHead className="text-muted-foreground">Email</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-border">
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay usuarios registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((user) => (
                            <TableRow key={user.id} className="border-border hover:bg-muted/50">
                                <TableCell className={`font-medium ${user.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {user.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.isActive
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(user)}
                                            className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
                                            title="Ver detalles"
                                        >
                                            <Eye className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(user)}
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                            title="Editar"
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(user.id)}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
