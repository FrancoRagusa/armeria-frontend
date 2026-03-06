import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";

// ✅ NUEVO: Admin
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminGuard from "./components/AdminGuard.jsx";

export default function App() {
  return (
    <div className="min-h-screen text-zinc-900">
      <Navbar />

      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:slug" element={<ProductoDetalle />} />

        {/* ✅ Admin (NO linkear en navbar) */}
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

      {/* WhatsApp flotante (global) */}
      <WhatsAppFloat />
    </div>
  );
}