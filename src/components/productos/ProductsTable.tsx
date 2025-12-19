import { Button } from "@/components/ui/button"
import { Edit2, Trash2, RotateCcw, Eye } from "lucide-react"
import type { Product } from "@/types/product"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProductsTableProps {
    data: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onView: (product: Product) => void;
}

export function ProductsTable({ data, onEdit, onDelete, onRestore, onView }: ProductsTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(value);
    }

    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Nombre</TableHead>
                        <TableHead className="text-muted-foreground">Categoría</TableHead>
                        <TableHead className="text-muted-foreground">Precio</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-border">
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No hay productos registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((product) => (
                            <TableRow key={product.id} className="border-border hover:bg-muted/50">
                                <TableCell className={`font-medium ${product.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                                    {product.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {product.categoryName || 'Sin Categoría'}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.isActive
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {product.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(product)}
                                            className="h-8 w-8 text-neutral-400 hover:text-foreground hover:bg-neutral-500/10"
                                            title="Ver detalle"
                                        >
                                            <Eye className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(product)}
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                            disabled={!product.isActive}
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>

                                        {product.isActive ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(product.id)}
                                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRestore(product.id)}
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
