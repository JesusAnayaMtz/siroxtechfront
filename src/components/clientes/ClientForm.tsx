import { useFormik } from "formik"
import * as Yup from "yup"
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
import type { Client, CreateClientDto } from "@/types/client"
import { useEffect } from "react"

interface ClientFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateClientDto) => Promise<void>;
    initialData?: Client | null;
    isLoading?: boolean;
    isReadOnly?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(50, "Máximo 50 caracteres")
        .required("El nombre es requerido"),
    email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
    phone: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(15, "Máximo 15 caracteres")
        .required("El teléfono es requerido"),
    address: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(200, "Máximo 200 caracteres")
        .required("La dirección es requerida"),
    zipCode: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(8, "Máximo 8 caracteres")
        .required("El código postal es requerido"),
})

export function ClientForm({ open, onClose, onSubmit, initialData, isLoading, isReadOnly = false }: ClientFormProps) {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            zipCode: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isReadOnly) return;
            try {
                await onSubmit(values)
                formik.resetForm()
            } catch (error) {
                // Error is handled by parent, but we catch here to prevent form reset
                console.error("Form submission error", error)
            }
        },
        validateOnBlur: false,
        validateOnChange: false,
    })

    useEffect(() => {
        if (open) {
            formik.setValues({
                name: initialData?.name || "",
                email: initialData?.email || "",
                phone: initialData?.phone || "",
                address: initialData?.address || "",
                zipCode: initialData?.zipCode || "",
            })
        } else {
            formik.resetForm()
        }
    }, [open, initialData])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {isReadOnly ? "Detalle de Cliente" : (initialData ? "Editar Cliente" : "Nuevo Cliente")}
                    </DialogTitle>
                    <DialogDescription>
                        {isReadOnly ? "Información detallada del cliente." : "Complete los datos del cliente."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej. Antonio Gonzalez"
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
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                            disabled={isReadOnly}
                        />
                        {formik.touched.email && formik.errors.email && !isReadOnly && (
                            <p className="text-sm text-red-400">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="5512345678"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                            disabled={isReadOnly}
                        />
                        {formik.touched.phone && formik.errors.phone && !isReadOnly && (
                            <p className="text-sm text-red-400">{formik.errors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-foreground">Dirección</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="Calle Principal #123"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                            disabled={isReadOnly}
                        />
                        {formik.touched.address && formik.errors.address && !isReadOnly && (
                            <p className="text-sm text-red-400">{formik.errors.address}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-foreground">Código Postal</Label>
                        <Input
                            id="zipCode"
                            name="zipCode"
                            placeholder="12345"
                            value={formik.values.zipCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                            disabled={isReadOnly}
                        />
                        {formik.touched.zipCode && formik.errors.zipCode && !isReadOnly && (
                            <p className="text-sm text-red-400">{formik.errors.zipCode}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="text-muted-foreground hover:text-foreground border-border" disabled={isLoading}>
                            {isReadOnly ? "Cerrar" : "Cancelar"}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
