import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/clienteApi.js";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data } = await api.get("/admin/me");
        if (mounted && data?.ok) {
          nav("/panel", { replace: true });
          return;
        }
      } catch {
        // no logueado
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data } = await api.post("/admin/login", {
        email: email.trim(),
        password,
      });

      if (data?.ok) {
        nav("/panel", { replace: true });
      } else {
        setErr("No se pudo iniciar sesión.");
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Error login");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm text-zinc-400">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.08),transparent_25%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/85 shadow-2xl p-7">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Panel administrativo
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Acceso restringido. Iniciá sesión para continuar.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">Email</label>
              <input
                className="w-full p-3 rounded-2xl bg-black/40 border border-zinc-800 outline-none focus:border-yellow-500/60 transition"
                placeholder="admin@tudominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  className="w-full p-3 pr-12 rounded-2xl bg-black/40 border border-zinc-800 outline-none focus:border-yellow-500/60 transition"
                  placeholder="Ingresá tu contraseña"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err ? (
              <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/40 p-3 rounded-2xl">
                {err}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full p-3 rounded-2xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}