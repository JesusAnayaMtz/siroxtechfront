
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button"
import { InputLogin } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
    email: Yup.string().email('Email Invalido').required('El email es requerido'),
    password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
})

import { useAuth } from "@/context/AuthContext"
import { login } from "@/services/authService";

// Formulario de inicio de sesión con validación y manejo de errores
const LoginForm = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { login: authLogin } = useAuth()

    // Obtiene la ubicación anterior o usa /dashboard por defecto
    const from = location.state?.from?.pathname || '/dashboard';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const response = await login(values.email, values.password);
                console.log('Login Exitoso', response)
                // Guarda el token en localStorage o en el estado global
                authLogin(response.access_token);
                // Redirige al usuario a la página principal
                navigate(from, { replace: true });
            } catch (error) {
                if (error instanceof Error) {
                    setFieldError('password', error.message);
                }
            } finally {
                setSubmitting(false);
            }
        }
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="email" className="text-white">Email</Label>
                <InputLogin type="email" id="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
            </div>
            <div>
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <InputLogin type="password" id="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                ) : null}
            </div>
            <Button type="submit" variant="login">Iniciar Sesion</Button>
        </form>
    )
};

export default LoginForm;