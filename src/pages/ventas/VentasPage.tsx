import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SalesTable } from "@/components/ventas/SalesTable"
import { CreateSaleForm } from "@/components/ventas/CreateSaleForm"
import { SaleDetailsModal } from "@/components/ventas/SaleDetailsModal"
import { salesService } from "@/services/salesService"
import { productsService } from "@/services/productsService"
import { usersService } from "@/services/usersService"
import { useAuth } from "@/context/AuthContext"
import type { Sale, CreateSaleDto } from "@/types/sale"
import type { Product } from "@/types/product"
import type { User } from "@/types/user"

export default function VentasPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Details Modal State
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const { isAuthenticated } = useAuth()

    const loadData = async () => {
        try {
            setIsLoading(true)
            const [salesData, productsData, usersData] = await Promise.all([
                salesService.findAll(),
                productsService.findAll(),
                usersService.findAll()
            ])
            console.log("Sales Data:", salesData)
            setSales(salesData)
            setProducts(productsData)
            setUsers(usersData)
        } catch (error) {
            console.error("Failed to load data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
        }
    }, [isAuthenticated])

    const handleCreateSale = async (data: CreateSaleDto) => {
        try {
            setIsSubmitting(true)
            await salesService.create(data)
            await loadData()
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error("Failed to create sale", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSale = async (id: string) => {
        if (!confirm("¿Está seguro de cancelar esta venta?")) return
        try {
            await salesService.remove(id)
            await loadData()
        } catch (error) {
            console.error("Failed to delete sale", error)
        }
    }

    const handleViewSale = (id: string) => {
        const sale = sales.find(s => s.id === id)
        if (sale) {
            setSelectedSale(sale)
            setIsDetailsModalOpen(true)
        }
    }

    const filteredSales = sales.filter(sale => {
        const term = searchTerm.toLowerCase();

        // Find user name
        const user = users.find(u => u.id === sale.userId);
        const userName = user?.name?.toLowerCase() || "";

        // Format date
        const dateStr = new Date(sale.createdAt).toLocaleString().toLowerCase();

        // Status
        const status = sale.canceled ? "cancelada" : "activa";

        return (
            userName.includes(term) ||
            dateStr.includes(term) ||
            status.includes(term)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Ventas</h1>
                    <p className="text-muted-foreground">Gestión de transacciones</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Plus className="mr-2 size-4" />
                    Nueva Venta
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por usuario, fecha o estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Cargando ventas...</div>
            ) : (
                <SalesTable
                    data={filteredSales}
                    users={users}
                    onView={handleViewSale}
                    onDelete={handleDeleteSale}
                />
            )}

            <CreateSaleForm
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSale}
                isLoading={isSubmitting}
            />

            <SaleDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                sale={selectedSale}
                products={products}
                users={users}
            />
        </div>
    )
}

