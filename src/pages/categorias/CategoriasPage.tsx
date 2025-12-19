import { useState } from "react"
import type { Category, CreateCategoryDto } from "@/types/category"
import { CategoriesTable } from "@/components/categorias/CategoriesTable"
import { CategoryForm } from "@/components/categorias/CategoryForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useRestoreCategory
} from "@/hooks/useCategories"

export default function CategoriasPage() {
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories()

    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()
    const deleteMutation = useDeleteCategory()
    const restoreMutation = useRestoreCategory()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const isLoading = isLoadingCategories ||
        createMutation.isPending || updateMutation.isPending ||
        deleteMutation.isPending || restoreMutation.isPending

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
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to delete category", error)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres restaurar esta categoría?")) return
        try {
            await restoreMutation.mutateAsync(id)
        } catch (error) {
            console.error("Failed to restore category", error)
        }
    }

    const handleSubmit = async (values: CreateCategoryDto) => {
        try {
            if (selectedCategory) {
                await updateMutation.mutateAsync({ id: selectedCategory.id, data: values })
            } else {
                await createMutation.mutateAsync(values)
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to save category", error)
        }
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
                    <p className="text-muted-foreground">Gestiona las categorías de tus productos</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 size-4" />
                    Nueva Categoría
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar categorías por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Cargando categorías...</div>
            ) : (
                <CategoriesTable
                    data={filteredCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                />
            )}

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
