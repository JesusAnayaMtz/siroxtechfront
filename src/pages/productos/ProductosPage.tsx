import { useState } from "react"
import type { Product, CreateProductDto } from "@/types/product"
import { ProductsTable } from "@/components/productos/ProductsTable"
import { ProductForm } from "@/components/productos/ProductForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
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
    const [isReadOnly, setIsReadOnly] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const isLoading = isLoadingProducts || isLoadingCategories ||
        createMutation.isPending || updateMutation.isPending ||
        deleteMutation.isPending || restoreMutation.isPending

    const handleCreate = () => {
        setSelectedProduct(null)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsReadOnly(false)
        setIsDialogOpen(true)
    }

    const handleView = (product: Product) => {
        setSelectedProduct(product)
        setIsReadOnly(true)
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
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) ||
            (product.categoryName && product.categoryName.toLowerCase().includes(term))
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Productos</h1>
                    <p className="text-muted-foreground">Gestiona el inventario de tus productos</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nuevo Producto
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Cargando productos...</div>
            ) : (
                <ProductsTable
                    data={sortedProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onView={handleView}
                />
            )}

            <ProductForm
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedProduct}
                categories={categories}
                isLoading={isLoading}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
