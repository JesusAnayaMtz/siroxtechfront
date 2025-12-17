import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function useLogout() {
    const navigate = useNavigate()
    const { logout: contextLogout } = useAuth()

    const logout = () => {
        contextLogout()
        navigate("/login", { replace: true })
    }

    return logout
}
