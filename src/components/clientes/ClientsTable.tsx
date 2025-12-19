import { Button } from "@/components/ui/button"
import { Edit2, Trash2, RotateCcw, Eye } from "lucide-react"
import type { Client } from "@/types/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface ClientsTableProps {
    data: Client[];
    onEdit: (client: Client) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onView: (client: Client) => void;
}

export function ClientsTable({ data, onEdit, onDelete, onRestore, onView }: ClientsTableProps) {
    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Nombre</TableHead>
                        <TableHead className="text-muted-foreground">Email</TableHead>
                        <TableHead className="text-muted-foreground">Teléfono</TableHead>
                        <TableHead className="text-muted-foreground">Dirección</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-border">
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No hay clientes registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((client) => (
                            <TableRow key={client.id} className="border-border hover:bg-muted/50">
                                <TableCell className={`font-medium ${client.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                                    {client.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{client.email}</TableCell>
                                <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                                <TableCell className="text-muted-foreground">{client.address}, {client.zipCode}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${client.isActive
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {client.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(client)}
                                            className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
                                            title="Ver detalles"
                                        >
                                            <Eye className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(client)}
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                            disabled={!client.isActive}
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>

                                        {client.isActive ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(client.id)}
                                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                title="Desactivar"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRestore(client.id)}
                                                className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                                title="Restaurar"
                                            >
                                                <RotateCcw className="size-4" />
                                            </Button>
                                        )}
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
