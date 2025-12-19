import * as React from "react"
import {
  LogOut,
  User,
} from "lucide-react"
import logoWeb from "@/assets/logoweb.png"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

import { menuData } from "@/config/menu"
import { useLogout } from "@/hooks/use-logout"
import { useAuth } from "@/context/AuthContext"

// Barra lateral principal de la aplicación que contiene la navegación y el perfil
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logout = useLogout()
  const { user } = useAuth()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between py-4 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <a href="/dashboard" className="flex items-center group-data-[collapsible=icon]:hidden">
            <img src={logoWeb} alt="Logo" className="h-10 w-auto cursor-pointer hover:opacity-75" />
          </a>
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <ModeToggle />
            <SidebarTrigger />
          </div>
          {/* Gatillo visible solo cuando está colapsado */}
          <div className="hidden group-data-[collapsible=icon]:block">
            <SidebarTrigger />
          </div>
        </div>
        <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
          <p className="text-base font-semibold text-sidebar-foreground">{user?.name || menuData.user.name}</p>
          <p className="text-sm text-sidebar-foreground/70">{user?.email || menuData.user.email}</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mi Perfil">
              <a href="/profile">
                <User />
                <span className="truncate">Mi Perfil</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Cerrar Sesión"
              className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
              onClick={logout}
            >
              <button>
                <LogOut />
                <span>Cerrar Sesión</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
