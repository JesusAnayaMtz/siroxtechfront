import { Button } from "@/components/ui/button"
import { Trash2, Eye } from "lucide-react"
import type { Sale } from "@/types/sale"
import type { User } from "@/types/user"
import type { Client } from "@/types/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SalesTableProps {
    data: Sale[];
    users: User[];
    clients: Client[];
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

// Tabla para visualizar el historial de ventas
export function SalesTable({ data, users, clients, onView, onDelete }: SalesTableProps) {
    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Cliente</TableHead>
                        <TableHead className="text-muted-foreground">Vendedor</TableHead>
                        <TableHead className="text-muted-foreground">Fecha</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-muted-foreground">Total</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-border">
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No hay ventas registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((sale) => {
                            const user = users.find(u => u.id === sale.userId);
                            const client = clients.find(c => c.id === sale.clientId);
                            return (
                                <TableRow key={sale.id} className="border-border hover:bg-muted/50">
                                    <TableCell className={`font-medium ${sale.canceled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                        {client?.name || 'Cliente General'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user?.name || sale.userId}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(sale.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${!sale.canceled
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {!sale.canceled ? 'Activa' : 'Cancelada'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                        ${sale.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onView(sale.id)}
                                                className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                                title="Ver Detalle"
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                            {!sale.canceled && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(sale.id)}
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    title="Cancelar"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
