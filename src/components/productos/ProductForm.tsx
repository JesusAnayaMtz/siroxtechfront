import { useFormik } from "formik"
import * as Yup from "yup"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Product, CreateProductDto } from "@/types/product"
import type { Category } from "@/types/category"
import { useEffect } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateProductDto) => Promise<void>;
    initialData?: Product | null;
    categories: Category[];
    isLoading?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    categoryId: Yup.string().required("La categoría es requerida"),
    price: Yup.number().min(0, "El precio no puede ser negativo").required("El precio es requerido"),
    description: Yup.string(),
})

export function ProductForm({ open, onClose, onSubmit, initialData, categories, isLoading }: ProductFormProps) {
    const formik = useFormik({
        initialValues: {
            name: "",
            categoryId: "",
            price: 0,
            description: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values)
            formik.resetForm()
        },
    })

    useEffect(() => {
        if (open) {
            // Logic to find the category ID if it's missing but we have the name
            let catId = initialData?.categoryId || "";
            if (!catId && initialData?.categoryName) {
                const foundCat = categories.find(c => c.name === initialData.categoryName);
                if (foundCat) catId = foundCat.id;
            }

            formik.setValues({
                name: initialData?.name || "",
                categoryId: catId,
                price: initialData?.price || 0,
                description: initialData?.description || "",
            })
        } else {
            formik.resetForm()
        }
    }, [open, initialData, categories])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {initialData ? "Editar Producto" : "Nuevo Producto"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete la información del producto a continuación.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej. iPhone 15"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-indigo-500"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-400">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId" className="text-white">Categoría</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1 text-sm shadow-sm transition-colors text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.categoryId && formik.errors.categoryId && (
                            <p className="text-sm text-red-400">{formik.errors.categoryId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-white">Precio</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0.00"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-indigo-500"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="text-sm text-red-400">{formik.errors.price}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Descripción</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Descripción opcional"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-indigo-500"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white" disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
