
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, RotateCcw } from "lucide-react"
import type { Category } from "@/types/category"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface CategoriesTableProps {
    data: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

// Tabla para visualizar, editar y eliminar categorías
export function CategoriesTable({ data, onEdit, onDelete, onRestore }: CategoriesTableProps) {
    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Nombre</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-border">
                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                No hay categorías registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((category) => (
                            <TableRow key={category.id} className="border-border hover:bg-muted/50">
                                <TableCell className={`font-medium ${category.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                                    {category.name}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${category.isActive
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {category.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                            disabled={!category.isActive} // Disable edit for inactive items
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>

                                        {category.isActive ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(category.id)}
                                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRestore(category.id)}
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
