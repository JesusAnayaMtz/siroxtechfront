import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
// import { usersService } from "@/services/usersService";
import type { UpdateUserDto } from "@/types/user";
import { Pencil, X, Check } from "lucide-react";

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .required("El nombre es requerido"),
    password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .optional(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .when("password", {
            is: (val: string) => val && val.length > 0,
            then: (schema) => schema.required("Confirma tu contraseña"),
            otherwise: (schema) => schema.optional(),
        }),
});

export default function ProfileForm() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            confirmPassword: "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const updateData: UpdateUserDto = {
                    name: values.name,
                };
                if (values.password) {
                    updateData.password = values.password;
                }

                // await usersService.update("userId", updateData);
                // setSuccess("Perfil actualizado correctamente");

                console.log("Updating user:", updateData);
                alert("Simulado: Perfil actualizado " + JSON.stringify(updateData));
                setIsEditing(false);

            } catch (err: any) {
                setError(err.message || "Error al actualizar perfil");
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleCancel = () => {
        formik.resetForm();
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="p-8">
            <div className="mb-8 relative flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-foreground text-center">Información Personal</h3>
                {!isEditing && (
                    <div className="mt-4">
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar Perfil
                        </Button>
                    </div>
                )}
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {error && (
                    <div className="rounded bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500">
                        {success}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                        Correo Electrónico
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        disabled
                        className="bg-muted text-muted-foreground border-border cursor-not-allowed opacity-70"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                        Nombre
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditing}
                        className={`${!isEditing ? "bg-muted/30" : "bg-background"} transition-colors`}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-destructive">{formik.errors.name}</p>
                    )}
                </div>

                {isEditing && (
                    <>
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="password" className="text-foreground">
                                Nueva Contraseña (Opcional)
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Dejar en blanco para mantener la actual"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-destructive">{formik.errors.password}</p>
                            )}
                        </div>

                        {formik.values.password && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="confirmPassword" className="text-foreground">
                                    Confirmar Nueva Contraseña
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{formik.errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "Guardando..." : "Guardar Cambios"}
                                {!isLoading && <Check className="h-4 w-4" />}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
