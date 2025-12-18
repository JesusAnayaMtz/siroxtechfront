import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import DashboardLayout from "@/layouts/DashboardLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import CategoriasPage from "./pages/categorias/CategoriasPage"
import ProductosPage from "./pages/productos/ProductosPage"
import VentasPage from "./pages/ventas/VentasPage"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/ventas" element={<VentasPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
