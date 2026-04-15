import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminGuard from "./components/AdminGuard.jsx";

function Layout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/panel");

  return (
    <div className="min-h-screen text-zinc-900">
      {!isAdminRoute ? <Navbar /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:slug" element={<ProductoDetalle />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/panel"
          element={
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute ? <WhatsAppFloat /> : null}
    </div>
  );
}

export default function App() {
  return <Layout />;
}