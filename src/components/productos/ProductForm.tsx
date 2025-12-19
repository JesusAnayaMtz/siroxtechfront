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
import { useEffect, useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { ImagePlus } from "lucide-react"

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateProductDto) => Promise<void>;
    initialData?: Product | null;
    categories: Category[];
    isLoading?: boolean;
    isReadOnly?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    categoryId: Yup.string().required("La categoría es requerida"),
    price: Yup.number().min(0, "El precio no puede ser negativo").required("El precio es requerido"),
    description: Yup.string(),
})

export function ProductForm({ open, onClose, onSubmit, initialData, categories, isLoading, isReadOnly = false }: ProductFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            categoryId: "",
            price: 0,
            description: "",
            file: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isReadOnly) return;
            await onSubmit(values)
            formik.resetForm()
            setPreviewUrl(null)
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
                file: null,
            })
            setPreviewUrl(initialData?.imageUrl || null);
        } else {
            formik.resetForm()
            setPreviewUrl(null)
        }
    }, [open, initialData, categories])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            const file = event.currentTarget.files[0];
            formik.setFieldValue("file", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-xl">
                        {isReadOnly ? "Detalle de Producto" : (initialData ? "Editar Producto" : "Nuevo Producto")}
                    </DialogTitle>
                    <DialogDescription>
                        {isReadOnly ? "Información detallada del producto." : "Complete la información del producto a continuación."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda: Datos del Formulario */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Ej. iPhone 15"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                                    disabled={isReadOnly}
                                />
                                {formik.touched.name && formik.errors.name && !isReadOnly && (
                                    <p className="text-sm text-red-400">{formik.errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryId" className="text-foreground">Categoría</Label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formik.values.categoryId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="flex h-9 w-full rounded-md border border-input bg-secondary px-3 py-1 text-sm shadow-sm transition-colors text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.categoryId && formik.errors.categoryId && !isReadOnly && (
                                    <p className="text-sm text-red-400">{formik.errors.categoryId}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-foreground">Precio</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                                    disabled={isReadOnly}
                                />
                                {formik.touched.price && formik.errors.price && !isReadOnly && (
                                    <p className="text-sm text-red-400">{formik.errors.price}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground">Descripción</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    placeholder="Descripción opcional"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        {/* Columna Derecha: Imagen */}
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="file" className="text-foreground mb-2">Imagen del Producto</Label>

                            <div className={`flex-1 rounded-lg border-2 border-dashed border-input bg-secondary/50 transition-colors relative group overflow-hidden flex flex-col items-center justify-center min-h-[300px] ${!isReadOnly ? 'hover:bg-secondary' : ''}`}>
                                {previewUrl ? (
                                    <>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-contain p-2"
                                        />
                                        {!isReadOnly && (
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium">Cambiar Imagen</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                        {!isReadOnly && (
                                            <>
                                                <p className="text-sm text-muted-foreground font-medium">Click para subir imagen</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                                            </>
                                        )}
                                        {isReadOnly && <p className="text-sm text-muted-foreground font-medium">Sin imagen</p>}
                                    </div>
                                )}

                                {!isReadOnly && (
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                            {isReadOnly ? "Cerrar" : "Cancelar"}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar Producto"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
