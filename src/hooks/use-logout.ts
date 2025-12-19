import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

// Hook personalizado para manejar el cierre de sesión y la redirección
export function useLogout() {
    const navigate = useNavigate()
    const { logout: contextLogout } = useAuth()

    const logout = () => {
        contextLogout()
        navigate("/login", { replace: true })
    }

    return logout
}
