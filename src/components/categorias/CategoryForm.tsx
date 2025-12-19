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
import type { Category, CreateCategoryDto } from "@/types/category"
import { useEffect } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface CategoryFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateCategoryDto) => Promise<void>;
    initialData?: Category | null;
    isLoading?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
})

// Componente de formulario para crear y editar categorías
export function CategoryForm({ open, onClose, onSubmit, initialData, isLoading }: CategoryFormProps) {
    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values)
            formik.resetForm()
        },
    })

    // Reinicia el formulario al abrir/cerrar o cambiar la selección
    useEffect(() => {
        if (open) {
            formik.setValues({
                name: initialData?.name || "",
            })
        } else {
            formik.resetForm()
        }
    }, [open, initialData])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {initialData ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete el nombre de la categoría.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej. Electrónica"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-indigo-500"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-400">{formik.errors.name}</p>
                        )}
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
