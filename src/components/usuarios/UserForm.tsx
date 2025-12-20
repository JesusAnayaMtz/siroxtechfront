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
import type { User, CreateUserDto } from "@/types/user"
import { useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateUserDto) => Promise<void>;
    initialData?: User | null;
    isLoading?: boolean;
    isReadOnly?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .required("El nombre es requerido"),
    email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
    password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .when('isEdit', {
            is: false,
            then: (schema) => schema.required("La contraseña es requerida"),
            otherwise: (schema) => schema.optional(),
        }),
})

export function UserForm({ open, onClose, onSubmit, initialData, isLoading, isReadOnly = false }: UserFormProps) {
    const isEdit = !!initialData;

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            isActive: true,
            isEdit: isEdit,
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isReadOnly) return;
            const submitData = { ...values };
            // Don't send empty password on edit
            if (isEdit && !submitData.password) {
                // @ts-ignore
                delete submitData.password;
            }
            // remove helper field
            // @ts-ignore
            delete submitData.isEdit;

            await onSubmit(submitData as CreateUserDto)
            formik.resetForm()
        },
        validateOnBlur: false,
        validateOnChange: false,
    })

    useEffect(() => {
        if (open) {
            formik.setValues({
                name: initialData?.name || "",
                email: initialData?.email || "",
                password: "",
                isActive: initialData?.isActive ?? true,
                isEdit: !!initialData,
            })
        } else {
            formik.resetForm()
        }
    }, [open, initialData])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {isReadOnly ? "Detalle de Usuario" : (initialData ? "Editar Usuario" : "Nuevo Usuario")}
                    </DialogTitle>
                    <DialogDescription>
                        {isReadOnly ? "Información del usuario." : "Complete los datos del usuario."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej. Juan Perez"
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
                            type="email"
                            name="email"
                            placeholder="usuario@sirox.com"
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

                    {!isReadOnly && (
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">
                                {isEdit ? "Contraseña (Opcional)" : "Contraseña"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder={isEdit ? "Dejar en blanco para no cambiar" : "******"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="bg-secondary border-input text-foreground focus-visible:ring-indigo-500"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-red-400">{formik.errors.password}</p>
                            )}
                        </div>
                    )}

                    {!isReadOnly && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formik.values.isActive}
                                onCheckedChange={(checked: boolean | string) => formik.setFieldValue("isActive", checked === true)}
                            />
                            <Label htmlFor="isActive" className="text-foreground">Usuario Activo</Label>
                        </div>
                    )}

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
