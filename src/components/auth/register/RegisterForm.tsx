import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/services/authService"
import { useNavigate } from "react-router-dom"
import type { CreateUserDto } from "@/types/user"

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .required("El nombre es requerido"),
    email: Yup.string()
        .email("Ingrese un correo electrónico válido")
        .required("El correo electrónico es requerido"),
    password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("La contraseña es requerida"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
})

export default function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            setError(null)
            try {
                // Destructure confirmPassword out and keep the rest
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirmPassword, ...registerData } = values;
                await register(registerData as CreateUserDto)
                navigate("/login")
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Error desconocido")
                }
            } finally {
                setIsLoading(false)
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                    Nombre
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus-visible:ring-indigo-500"
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-400">{formik.errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                    Correo Electrónico
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus-visible:ring-indigo-500"
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-400">{formik.errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                    Contraseña
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus-visible:ring-indigo-500"
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-400">{formik.errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                    Confirmar Contraseña
                </Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus-visible:ring-indigo-500"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-sm text-red-400">{formik.errors.confirmPassword}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isLoading}
            >
                {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
        </form>
    )
}
