// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/clienteApi.js";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // ✅ baseURL ya incluye "/api"
      const { data } = await api.post("/admin/login", { email, password });

      if (data?.ok && data?.token) {
        localStorage.setItem("admin_token", data.token);
        nav("/panel");
      } else {
        setErr("No se pudo iniciar sesión.");
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Error login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800"
      >
        <h1 className="text-xl font-semibold">Acceso de administración</h1>
        <p className="text-sm text-zinc-400 mt-1">Solo para el dueño del local</p>

        <div className="mt-4 space-y-3">
          <input
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}

        <button
          disabled={loading}
          className="mt-4 w-full p-3 rounded-xl bg-yellow-600 text-black font-semibold disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}