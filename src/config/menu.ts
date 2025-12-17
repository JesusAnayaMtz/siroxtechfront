import {
    ShoppingBag,
    Tags,
    DollarSign,
    Home,
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
            title: "Ventas",
            url: "/ventas",
            icon: DollarSign,
        },
    ],
}
