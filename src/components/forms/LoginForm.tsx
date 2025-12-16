
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../services/authService";

const validationSchema = Yup.object({
    email: Yup.string().email('Email Invalido').required('El email es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
})

const LoginForm = () => {
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
                localStorage.setItem('token', response.access_token);
                // Redirige al usuario a la página principal
                window.location.href = '/dashboard';
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
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                <input type="email" id="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                    className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-neutral-800 text-foreground" />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">Contraseña</label>
                <input type="password" id="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                    className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-neutral-800 text-foreground" />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                ) : null}
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-ms shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-900 focus:outline-none
            focus:ring-2 focus:ring-indigo-500">Iniciar Sesion</button>
        </form>
    )
};

export default LoginForm;