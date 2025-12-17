import { useEffect, useState } from "react"
import type { Category, CreateCategoryDto } from "@/types/category"
import { categoriesService } from "@/services/categoriesService"
import { CategoriesTable } from "@/components/categorias/CategoriesTable"
import { CategoryForm } from "@/components/categorias/CategoryForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const data = await categoriesService.findAll()
            setCategories(data)
        } catch (error) {
            console.error("Failed to fetch categories", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleCreate = () => {
        setSelectedCategory(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres desactivar esta categoría?")) return
        try {
            await categoriesService.remove(id)
            await fetchCategories()
        } catch (error) {
            console.error("Failed to delete category", error)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres restaurar esta categoría?")) return
        try {
            await categoriesService.restore(id)
            await fetchCategories()
        } catch (error) {
            console.error("Failed to restore category", error)
        }
    }

    const handleSubmit = async (values: CreateCategoryDto) => {
        try {
            if (selectedCategory) {
                await categoriesService.update(selectedCategory.id, values)
            } else {
                await categoriesService.create(values)
            }
            setIsDialogOpen(false)
            await fetchCategories()
        } catch (error) {
            console.error("Failed to save category", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categorías</h1>
                    <p className="text-neutral-400">Gestiona las categorías de tus productos</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nueva Categoría
                </Button>
            </div>

            <CategoriesTable
                data={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />

            <CategoryForm
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedCategory}
                isLoading={isLoading}
            />
        </div>
    )
}
