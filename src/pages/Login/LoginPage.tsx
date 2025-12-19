import LoginForm from "@/components/auth/login/LoginForm"
import { Link } from "react-router-dom"
import logoWeb from "@/assets/logoweb.png"


// Página de inicio de sesión principal
const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-neutral-800 rounded-lg shadow-lg">
                <div>
                    <img src={logoWeb} alt="Logo SyroxTech" className="mx-auto h-28 w-auto" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Iniciar Sesion</h2>
                </div>
                <LoginForm />

                <div className="text-center mt-4">
                    <p className="text-sm text-neutral-400">
                        ¿No tienes cuenta?{" "}
                        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage