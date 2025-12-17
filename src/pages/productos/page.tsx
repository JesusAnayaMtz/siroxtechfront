import { useEffect, useState } from "react"
import type { Product, CreateProductDto } from "@/types/product"
import type { Category } from "@/types/category"
import { productsService } from "@/services/productsService"
import { categoriesService } from "@/services/categoriesService"
import { ProductsTable } from "@/components/productos/ProductsTable"
import { ProductForm } from "@/components/productos/ProductForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProductosPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [productsData, categoriesData] = await Promise.all([
                productsService.findAll(),
                categoriesService.findAll()
            ])
            setProducts(productsData.sort((a, b) => a.name.localeCompare(b.name)))
            setCategories(categoriesData)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refreshProducts = async () => {
        try {
            const data = await productsService.findAll()
            setProducts(data.sort((a, b) => a.name.localeCompare(b.name)))
        } catch (error) {
            console.error("Failed to refresh products", error)
        }
    }

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
            await productsService.remove(id)
            await refreshProducts()
        } catch (error) {
            console.error("Failed to delete product", error)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres restaurar este producto?")) return
        try {
            await productsService.restoreProduct(id)
            await refreshProducts()
        } catch (error) {
            console.error("Failed to restore product", error)
        }
    }

    const handleSubmit = async (values: CreateProductDto) => {
        try {
            if (selectedProduct) {
                await productsService.update(selectedProduct.id, values)
            } else {
                await productsService.create(values)
            }
            setIsDialogOpen(false)
            await refreshProducts()
        } catch (error) {
            console.error("Failed to save product", error)
        }
    }

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
                data={products}
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
