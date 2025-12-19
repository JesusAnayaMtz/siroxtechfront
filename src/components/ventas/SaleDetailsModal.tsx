import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import type { Sale } from "@/types/sale"
import type { Product } from "@/types/product"
import type { User } from "@/types/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SaleDetailsModalProps {
    sale: Sale | null;
    products: Product[];
    users: User[];
    open: boolean;
    onClose: () => void;
}

export function SaleDetailsModal({ sale, products, users, open, onClose }: SaleDetailsModalProps) {
    if (!sale) return null

    const user = users.find(u => u.id === sale.userId);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Detalle de Venta</DialogTitle>
                    <DialogDescription>
                        ID: {sale.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="text-foreground">{new Date(sale.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Usuario:</span>
                            <span className="text-foreground">{user?.name || sale.userId}</span>
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-secondary/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border">
                                    <TableHead className="text-muted-foreground">Producto</TableHead>
                                    <TableHead className="text-right text-muted-foreground">Cant.</TableHead>
                                    <TableHead className="text-right text-muted-foreground">Precio</TableHead>
                                    <TableHead className="text-right text-muted-foreground">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sale.items?.map((item) => {
                                    const product = products.find(p => p.id === item.productId);
                                    return (
                                        <TableRow key={item.id} className="border-border">
                                            <TableCell className="text-foreground">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{product?.name || item.productId}</span>
                                                    {product?.description && (
                                                        <span className="text-xs text-muted-foreground">{product.description}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-foreground">${item.unitPrice.toFixed(2)}</TableCell>
                                            <TableCell className="text-right text-foreground font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <div className="text-right">
                            <span className="text-muted-foreground text-sm block">Total</span>
                            <span className="text-2xl font-bold text-foreground">${sale.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
