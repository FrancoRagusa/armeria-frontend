import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/clienteApi.js";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const { data } = await api.get("/admin/me");
        if (mounted) {
          setStatus(data?.ok ? "ok" : "denied");
        }
      } catch {
        if (mounted) setStatus("denied");
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm text-zinc-400">Verificando acceso...</div>
      </div>
    );
  }

  if (status !== "ok") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}