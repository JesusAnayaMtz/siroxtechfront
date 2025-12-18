import { Button } from "@/components/ui/button"
import { Trash2, Eye } from "lucide-react"
import type { Sale } from "@/types/sale"
import type { User } from "@/types/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SalesTableProps {
    data: Sale[];
    users: User[];
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

export function SalesTable({ data, users, onView, onDelete }: SalesTableProps) {
    return (
        <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                        <TableHead className="text-neutral-400">ID Venta</TableHead>
                        <TableHead className="text-neutral-400">Usuario</TableHead>
                        <TableHead className="text-neutral-400">Fecha</TableHead>
                        <TableHead className="text-neutral-400">Estado</TableHead>
                        <TableHead className="text-neutral-400">Total</TableHead>
                        <TableHead className="text-right text-neutral-400">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-neutral-800">
                            <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                                No hay ventas registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((sale) => {
                            const user = users.find(u => u.id === sale.userId);
                            return (
                                <TableRow key={sale.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className={`font-medium ${sale.canceled ? 'text-neutral-500 line-through' : 'text-white'}`}>
                                        {sale.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {user?.name || sale.userId}
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
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
                                    <TableCell className="text-neutral-300">
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
