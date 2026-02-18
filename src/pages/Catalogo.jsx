import { useEffect, useMemo, useState } from "react";
import { api } from "../api/clienteApi.js";
import ProductoCard from "../components/ProductoCard.jsx";
import Paginacion from "../components/Paginacion.jsx";
import FiltrosDrawer from "../components/FiltrosDrawer.jsx";

function Chip({ label, value, onClear }) {
  if (!value) return null;
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-black/25 text-white/80 hover:border-[var(--dorado)] hover:text-white transition"
    >
      <span className="text-white/60 text-xs">{label}</span>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-white/50">✕</span>
    </button>
  );
}

export default function Catalogo() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // filtros
  const [buscar, setBuscar] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [marcaSlug, setMarcaSlug] = useState("");
  const [calibre, setCalibre] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [aumento, setAumento] = useState("");

  // UI
  const [drawer, setDrawer] = useState(false);

  // paginación
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(12);

  const [filtros, setFiltros] = useState({
    categorias: [],
    marcas: [],
    calibres: [],
    aumentos: [],
    precios: { min_precio: 0, max_precio: 0 },
  });

  async function cargarFiltros() {
    try {
      const r = await api.get("/filtros");
      const data = r.data || {};
      setFiltros({
        categorias: data.categorias || [],
        marcas: data.marcas || [],
        calibres: data.calibres || [],
        aumentos: data.aumentos || [],
        precios: data.precios || { min_precio: 0, max_precio: 0 },
      });
    } catch (_) {
      // fallback si querés mantenerlo, pero ideal es que /filtros siempre funcione.
    }
  }

  const params = useMemo(() => {
    const p = { pagina, limite };
    if (buscar.trim()) p.buscar = buscar.trim();
    if (categoriaSlug) p.categoria_slug = categoriaSlug;
    if (marcaSlug) p.marca_slug = marcaSlug;
    if (calibre) p.calibre = calibre;
    if (precioMin !== "") p.precioMin = precioMin;
    if (precioMax !== "") p.precioMax = precioMax;
    if (categoriaSlug === "opticas" && aumento) p.aumento = aumento;
    return p;
  }, [buscar, categoriaSlug, marcaSlug, calibre, precioMin, precioMax, aumento, pagina, limite]);

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
    setCalibre("");
    setPrecioMin("");
    setPrecioMax("");
    setAumento("");
    setPagina(1);
  }

  useEffect(() => {
    if (categoriaSlug !== "opticas") setAumento("");
  }, [categoriaSlug]);

  const categoriaNombre = filtros.categorias.find((c) => c.slug === categoriaSlug)?.nombre || "";
  const marcaNombre = filtros.marcas.find((m) => m.slug === marcaSlug)?.nombre || "";

  const precioChip =
    precioMin || precioMax
      ? `${precioMin ? Number(precioMin).toLocaleString("es-AR") : "0"} – ${
          precioMax ? Number(precioMax).toLocaleString("es-AR") : "∞"
        }`
      : "";

  return (
    <div className="bg-[var(--fondo)]">
      <main className="max-w-6xl mx-auto px-4 py-10 text-white">
        {/* Header compacto + buscador arriba izquierda */}
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
              <p className="text-white/60 mt-2">
                Explorá productos por categorías y marcas. Consulta directa por WhatsApp.
              </p>

              {/* Search abajo del título (izquierda) */}
              <div className="mt-6 max-w-xl">
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

              {/* Chips de filtros activos */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip
                  label="Categoría"
                  value={categoriaNombre}
                  onClear={() => {
                    setCategoriaSlug("");
                    setPagina(1);
                  }}
                />
                <Chip
                  label="Marca"
                  value={marcaNombre}
                  onClear={() => {
                    setMarcaSlug("");
                    setPagina(1);
                  }}
                />
                <Chip
                  label="Calibre"
                  value={calibre}
                  onClear={() => {
                    setCalibre("");
                    setPagina(1);
                  }}
                />
                <Chip
                  label="Precio"
                  value={precioChip}
                  onClear={() => {
                    setPrecioMin("");
                    setPrecioMax("");
                    setPagina(1);
                  }}
                />
                {categoriaSlug === "opticas" ? (
                  <Chip
                    label="Aumento"
                    value={aumento}
                    onClear={() => {
                      setAumento("");
                      setPagina(1);
                    }}
                  />
                ) : null}
              </div>
            </div>

            {/* Acciones derecha */}
            <div className="flex gap-2">
              <button
                onClick={() => setDrawer(true)}
                className="px-5 py-3 rounded-2xl border border-white/10 bg-black/25 text-white/80 hover:border-[var(--dorado)] hover:text-white transition"
              >
                Filtros
              </button>

              <button
                onClick={limpiar}
                className="px-5 py-3 rounded-2xl bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
              >
                Limpiar todo
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="mt-8">
          {error ? (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-white/80">
              {error}
            </div>
          ) : null}

          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
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
        </div>

        {/* Drawer de filtros */}
        <FiltrosDrawer
          abierto={drawer}
          onCerrar={() => setDrawer(false)}
          filtros={filtros}
          categoriaSlug={categoriaSlug}
          marcaSlug={marcaSlug}
          calibre={calibre}
          precioMin={precioMin}
          precioMax={precioMax}
          aumento={aumento}
          onCambiarCategoria={(slug) => {
            setCategoriaSlug(slug);
            setPagina(1);
          }}
          onCambiarMarca={(slug) => {
            setMarcaSlug(slug);
            setPagina(1);
          }}
          onCambiarCalibre={(v) => {
            setCalibre(v);
            setPagina(1);
          }}
          onCambiarPrecioMin={(v) => {
            setPrecioMin(v);
            setPagina(1);
          }}
          onCambiarPrecioMax={(v) => {
            setPrecioMax(v);
            setPagina(1);
          }}
          onCambiarAumento={(v) => {
            setAumento(v);
            setPagina(1);
          }}
          onLimpiar={limpiar}
        />
      </main>
    </div>
  );
}
