import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { menuData } from "@/config/menu"
import logoWeb from "@/assets/logoweb.png"
import { ModeToggle } from "@/components/mode-toggle"

import { useLogout } from "@/hooks/use-logout"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const logout = useLogout()
    const { user } = useAuth()

    return (
        <SidebarProvider>
            {/* Barra lateral de escritorio - Oculta en móvil */}
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            <SidebarInset>
                {/* Cabecera Móvil */}
                <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
                    <img src={logoWeb} alt="Logo" className="h-8 w-auto" />
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground hover:text-muted-foreground focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </header>

                {/* Menú desplegable móvil */}
                {isMobileMenuOpen && (
                    <div className="border-b bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                <div className="size-8 rounded-full bg-muted-foreground/20" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{user?.name || menuData.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || menuData.user.email}</p>
                                </div>
                            </div>

                            {/* Elementos del menú */}
                            {menuData.navMain.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="size-5 text-muted-foreground" />
                                    {item.title}
                                </a>
                            ))}
                            <button
                                className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
                                onClick={() => {
                                    logout()
                                    setIsMobileMenuOpen(false)
                                }}
                            >
                                <LogOut className="size-5" />
                                Cerrar Sesión
                            </button>
                        </nav>
                    </div>
                )}

                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
