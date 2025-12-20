import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import RegisterPage from "./pages/Login/RegisterPage"
import ProfilePage from "./pages/profile/ProfilePage"
import DashboardLayout from "@/layouts/DashboardLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import CategoriasPage from "./pages/categorias/CategoriasPage"
import ProductosPage from "./pages/productos/ProductosPage"
import ClientsPage from "./pages/clientes/ClientsPage"
import UsersPage from "./pages/usuarios/UsersPage"
import VentasPage from "./pages/ventas/VentasPage"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/ventas" element={<VentasPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
