import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Plus, Trash2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { productsService } from "@/services/productsService"
import type { Product } from "@/types/product"
import type { CreateSaleDto } from "@/types/sale"

interface CreateSaleFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateSaleDto) => Promise<void>;
    isLoading?: boolean;
}

// El esquema valida que haya al menos un producto en la venta
const validationSchema = Yup.object({
    items: Yup.array().of(
        Yup.object({
            productId: Yup.string().required(),
            quantity: Yup.number().min(1).required(),
        })
    ).min(1, "Debe agregar al menos un producto"),
})

export function CreateSaleForm({ open, onClose, onSubmit, isLoading }: CreateSaleFormProps) {
    const [products, setProducts] = useState<Product[]>([])

    // Estado local para los inputs de "Agregar Item"
    const [selectedProductId, setSelectedProductId] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)

    // Cargar productos al montar el componente
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await productsService.findAll()
                setProducts(data.filter(p => p.isActive)) // Solo productos activos
            } catch (error) {
                console.error("Failed to load products", error)
            }
        }
        loadProducts()
    }, [])

    const formik = useFormik<CreateSaleDto>({
        initialValues: {
            items: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values)
            handleClose()
        },
        validateOnBlur: false,
        validateOnChange: false,
    })

    const handleClose = () => {
        formik.resetForm()
        setSelectedProductId("")
        setQuantity(1)
        onClose()
    }

    const handleAddItem = () => {
        if (!selectedProductId || quantity < 1) return

        const product = products.find(p => p.id === selectedProductId)
        if (!product) return

        // Verificamos si ya existe para actualizar la cantidad
        const existingItemIndex = formik.values.items.findIndex(item => item.productId === selectedProductId)

        if (existingItemIndex >= 0) {
            const newItems = [...formik.values.items]
            newItems[existingItemIndex].quantity += quantity
            formik.setFieldValue("items", newItems)
        } else {
            formik.setFieldValue("items", [
                ...formik.values.items,
                { productId: selectedProductId, quantity }
            ])
        }

        // Reseteamos los inputs
        setSelectedProductId("")
        setQuantity(1)
    }

    const handleRemoveItem = (index: number) => {
        const newItems = [...formik.values.items]
        newItems.splice(index, 1)
        formik.setFieldValue("items", newItems)
    }

    const handleUpdateQuantity = (index: number, change: number) => {
        const newItems = [...formik.values.items]
        const currentItem = newItems[index]
        const newQuantity = currentItem.quantity + change

        if (newQuantity < 1) return

        newItems[index] = { ...currentItem, quantity: newQuantity }
        formik.setFieldValue("items", newItems)
    }

    // Calcular el total
    const total = formik.values.items.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)
        return acc + (product ? product.price * item.quantity : 0)
    }, 0)

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Nueva Venta</DialogTitle>
                    <DialogDescription>
                        Agregue productos a la venta.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Sección de agregar producto */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label className="text-foreground">Producto</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                <option value="">Seleccionar producto...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ${product.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-24 space-y-2">
                            <Label className="text-foreground">Cantidad</Label>
                            <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="bg-secondary border-input text-foreground"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddItem}
                            disabled={!selectedProductId}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    {/* Lista de items agregados */}
                    <div className="rounded-md border border-border bg-secondary/50 p-2 min-h-[150px] max-h-[300px] overflow-y-auto">
                        {formik.values.items.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                No hay productos agregados.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {formik.values.items.map((item, index) => {
                                    const product = products.find(p => p.id === item.productId)
                                    if (!product) return null

                                    return (
                                        <div key={item.productId} className="flex items-center justify-between p-2 rounded bg-background border border-border">
                                            <div className="text-sm">
                                                <div className="text-foreground font-medium">{product.name}</div>
                                                <div className="text-muted-foreground">
                                                    {item.quantity} x ${product.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 bg-secondary rounded-md p-0.5">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-foreground hover:bg-background"
                                                        onClick={() => handleUpdateQuantity(index, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <span className="text-xs">-</span>
                                                    </Button>
                                                    <span className="text-xs w-6 text-center text-foreground">{item.quantity}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-foreground hover:bg-background"
                                                        onClick={() => handleUpdateQuantity(index, 1)}
                                                    >
                                                        <span className="text-xs">+</span>
                                                    </Button>
                                                </div>

                                                <div className="text-foreground font-bold w-20 text-right">
                                                    ${(item.quantity * product.price).toFixed(2)}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Total y errores*/}
                    <div className="flex justify-between items-center border-t border-border pt-4">
                        <div>
                            {typeof formik.errors.items === 'string' && (
                                <p className="text-sm text-red-400">{formik.errors.items}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-muted-foreground text-sm">Total a pagar:</span>
                            <div className="text-2xl font-bold text-foreground">${total.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={handleClose} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={() => formik.handleSubmit()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading || formik.values.items.length === 0}
                    >
                        {isLoading ? "Procesando..." : "Finalizar Venta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
