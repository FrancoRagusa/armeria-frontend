import { useEffect, useMemo, useState } from "react";
import { api } from "../api/clienteApi.js";
import ProductoCard from "../components/ProductoCard.jsx";
import FiltrosSidebar from "../components/FiltrosSidebar.jsx";
import Paginacion from "../components/Paginacion.jsx";

export default function Catalogo() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [buscar, setBuscar] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [marcaSlug, setMarcaSlug] = useState("");
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(12);

  const [filtros, setFiltros] = useState({ categorias: [], marcas: [] });

  async function cargarFiltros() {
    try {
      const r = await api.get("/filtros");
      if (r.data?.ok) {
        setFiltros({ categorias: r.data.categorias || [], marcas: r.data.marcas || [] });
        return;
      }
    } catch (_) {}

    const [c, m] = await Promise.all([api.get("/categorias"), api.get("/marcas")]);
    setFiltros({
      categorias: c.data?.items || [],
      marcas: m.data?.items || [],
    });
  }

  const params = useMemo(() => {
    const p = { pagina, limite };
    if (buscar.trim()) p.buscar = buscar.trim();
    if (categoriaSlug) p.categoria_slug = categoriaSlug;
    if (marcaSlug) p.marca_slug = marcaSlug;
    return p;
  }, [buscar, categoriaSlug, marcaSlug, pagina, limite]);

  async function cargarProductos() {
    setCargando(true);
    setError("");
    try {
      const r = await api.get("/productos", { params });
      setItems(r.data?.items || []);
      setTotal(r.data?.total || 0);
    } catch (e) {
      setError("No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarFiltros();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [params]);

  function limpiar() {
    setBuscar("");
    setCategoriaSlug("");
    setMarcaSlug("");
    setPagina(1);
  }

  return (
    <div className="bg-[var(--fondo)]">
      <main className="max-w-6xl mx-auto px-4 py-10 text-white">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
            <p className="text-white/60 mt-2">
              Explorá productos por categorías y marcas. Consulta directa por WhatsApp.
            </p>
          </div>

          <div className="w-full md:w-[360px]">
            <label className="text-xs font-semibold text-white/50 tracking-[0.18em] uppercase">
              Buscar
            </label>
            <input
              value={buscar}
              onChange={(e) => {
                setBuscar(e.target.value);
                setPagina(1);
              }}
              placeholder="Ej: Glock, 9mm, Bersa..."
              className="mt-2 w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/25 text-white placeholder:text-white/30 outline-none focus:border-[var(--dorado)] transition"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
          <FiltrosSidebar
            filtros={filtros}
            categoriaSlug={categoriaSlug}
            marcaSlug={marcaSlug}
            onCambiarCategoria={(slug) => {
              setCategoriaSlug(slug);
              setPagina(1);
            }}
            onCambiarMarca={(slug) => {
              setMarcaSlug(slug);
              setPagina(1);
            }}
            onLimpiar={limpiar}
          />

          <section>
            {error ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-white/80">
                {error}
              </div>
            ) : null}

            {cargando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[28px] border border-white/10 bg-black/25 overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-white/5 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-32 bg-white/10 animate-pulse rounded" />
                      <div className="h-4 w-48 bg-white/10 animate-pulse rounded" />
                      <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
                      <div className="h-10 w-full bg-white/10 animate-pulse rounded-2xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-white/80">
                No hay productos para mostrar con estos filtros.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((p) => (
                    <ProductoCard key={p.id} p={p} />
                  ))}
                </div>

                <Paginacion
                  pagina={pagina}
                  total={total}
                  limite={limite}
                  onCambiarPagina={(p) => setPagina(p)}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
