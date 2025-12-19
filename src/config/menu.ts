import {
    ShoppingBag,
    Tags,
    DollarSign,
    Home,
    Users,
} from "lucide-react"

export const menuData = {
    user: {
        name: "Usuario",
        email: "usuario@ejemplo.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Inicio",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Categorías",
            url: "/categorias",
            icon: Tags,
        },
        {
            title: "Productos",
            url: "/productos",
            icon: ShoppingBag,
        },
        {
            title: "Clientes",
            url: "/clientes",
            icon: Users,
        },
        {
            title: "Ventas",
            url: "/ventas",
            icon: DollarSign,
        },
    ],
}
