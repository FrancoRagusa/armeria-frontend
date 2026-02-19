import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";

export default function App() {
  return (
    <div className="min-h-screen text-zinc-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:slug" element={<ProductoDetalle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* WhatsApp flotante (global) */}
      <WhatsAppFloat />
    </div>
  );
}
