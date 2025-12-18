import { useState, useEffect } from "react"
import { DollarSign, XCircle, TrendingUp } from "lucide-react"
import { salesService } from "@/services/salesService"
import { productsService } from "@/services/productsService"
import type { Sale } from "@/types/sale"
import type { Product } from "@/types/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [salesData, productsData] = await Promise.all([
                    salesService.findAll(),
                    productsService.findAll()
                ])
                setSales(salesData)
                setProducts(productsData)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Metrics Calculation
    const activeSales = sales.filter(s => !s.canceled)
    const canceledSales = sales.filter(s => s.canceled)

    const totalSalesCount = activeSales.length
    const totalSalesAmount = activeSales.reduce((acc, curr) => acc + curr.total, 0)

    const totalCanceledCount = canceledSales.length
    const totalCanceledAmount = canceledSales.reduce((acc, curr) => acc + curr.total, 0)

    // Top Selling Product Logic
    const productSalesMap = new Map<string, number>()
    activeSales.forEach(sale => {
        sale.items.forEach(item => {
            const currentQty = productSalesMap.get(item.productId) || 0
            productSalesMap.set(item.productId, currentQty + item.quantity)
        })
    })

    let topProductId = ""
    let maxQuantity = 0
    productSalesMap.forEach((qty, id) => {
        if (qty > maxQuantity) {
            maxQuantity = qty
            topProductId = id
        }
    })

    const topProduct = products.find(p => p.id === topProductId)

    if (isLoading) {
        return <div className="text-center text-neutral-400 py-8">Cargando dashboard...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Sales Amount */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ventas Totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${totalSalesAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalSalesCount} transacciones activas
                        </p>
                    </CardContent>
                </Card>

                {/* Top Product */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Producto Más Vendido
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground truncate" title={topProduct?.name || "Sin datos"}>
                            {topProduct?.name || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {maxQuantity} unidades vendidas
                        </p>
                    </CardContent>
                </Card>

                {/* Canceled Sales Amount */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Monto Cancelado
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${totalCanceledAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Ingresos perdidos
                        </p>
                    </CardContent>
                </Card>

                {/* Canceled Sales Count */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ventas Canceladas
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{totalCanceledCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Transacciones canceladas
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

