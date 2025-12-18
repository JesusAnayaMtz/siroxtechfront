import { useState } from "react"
import type { Product, CreateProductDto } from "@/types/product"
import { ProductsTable } from "@/components/productos/ProductsTable"
import { ProductForm } from "@/components/productos/ProductForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    useProducts,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    useRestoreProduct
} from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"

export default function ProductosPage() {
    const { data: products = [], isLoading: isLoadingProducts } = useProducts()
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories()

    const createMutation = useCreateProduct()
    const updateMutation = useUpdateProduct()
    const deleteMutation = useDeleteProduct()
    const restoreMutation = useRestoreProduct()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const isLoading = isLoadingProducts || isLoadingCategories ||
        createMutation.isPending || updateMutation.isPending ||
        deleteMutation.isPending || restoreMutation.isPending

    const handleCreate = () => {
        setSelectedProduct(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres desactivar este producto?")) return
        try {
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to delete product", error)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres restaurar este producto?")) return
        try {
            await restoreMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to restore product", error)
        }
    }

    const handleSubmit = async (values: CreateProductDto) => {
        try {
            if (selectedProduct) {
                await updateMutation.mutateAsync({ id: selectedProduct.id, data: values })
            } else {
                await createMutation.mutateAsync(values)
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to save product", error)
        }
    }

    // Sort products by name (client-side sort of the fetched data)
    const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Productos</h1>
                    <p className="text-neutral-400">Gestiona el inventario de tus productos</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nuevo Producto
                </Button>
            </div>

            <ProductsTable
                data={sortedProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />

            <ProductForm
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedProduct}
                categories={categories}
                isLoading={isLoading}
            />
        </div>
    )
}
