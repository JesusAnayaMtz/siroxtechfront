import LoginForm from "@/components/auth/login/LoginForm"



const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-neutral-800 rounded-lg shadow-lg">
                <div>
                    <img src="./src/assets/logoweb.png" alt="Logo SyroxTech" className="mx-auto h-28 w-auto" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Iniciar Sesion</h2>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage