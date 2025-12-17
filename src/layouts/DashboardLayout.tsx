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

import { useLogout } from "@/hooks/use-logout"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const logout = useLogout()
    const { user } = useAuth()

    return (
        <SidebarProvider>
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            <SidebarInset>
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b bg-neutral-900 px-4 md:hidden">
                    <img src={logoWeb} alt="Logo" className="h-8 w-auto" />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white hover:text-neutral-300 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </header>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="border-b bg-neutral-900 px-4 py-4 md:hidden animate-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 rounded-lg bg-neutral-800 p-3">
                                <div className="size-8 rounded-full bg-neutral-700" /> {/* Placeholder avatar if needed or use image */}
                                <div>
                                    <p className="text-sm font-semibold text-white">{user?.name || menuData.user.name}</p>
                                    <p className="text-xs text-neutral-400">{user?.email || menuData.user.email}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            {menuData.navMain.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-white hover:bg-neutral-800"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="size-5 text-neutral-400" />
                                    {item.title}
                                </a>
                            ))}

                            {/* Logout */}
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
