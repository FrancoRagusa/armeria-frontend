import { useEffect } from "react";

export default function FiltrosDrawer({
  abierto,
  onCerrar,
  filtros,
  categoriaSlug,
  marcaSlug,
  calibre,
  precioMin,
  precioMax,
  aumento,

  onCambiarCategoria,
  onCambiarMarca,
  onCambiarCalibre,
  onCambiarPrecioMin,
  onCambiarPrecioMax,
  onCambiarAumento,
  onLimpiar,
}) {
  const mostrarAumento = categoriaSlug === "opticas";

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onCerrar?.();
    }
    if (abierto) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onCerrar]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        abierto ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!abierto}
    >
      {/* Backdrop */}
      <div
        onClick={onCerrar}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          abierto ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#0b0b0b] border-l border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.75)] transition-transform ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white/50 tracking-[0.18em] uppercase">
              Filtros
            </div>
            <div className="text-white font-semibold mt-1">Refiná tu búsqueda</div>
          </div>

          <button
            onClick={onCerrar}
            className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-white/70 hover:text-white hover:border-[var(--dorado)] transition"
          >
            Cerrar
          </button>
        </div>

        <div className="p-5 overflow-auto h-[calc(100%-72px)]">
          {/* Acciones */}
          <div className="flex gap-2">
            <button
              onClick={onLimpiar}
              className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-black/30 text-white/80 hover:border-[var(--dorado)] hover:text-white transition"
            >
              Limpiar
            </button>
            <button
              onClick={onCerrar}
              className="flex-1 px-4 py-3 rounded-2xl bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
            >
              Ver resultados
            </button>
          </div>

          {/* Categorías */}
          <div className="mt-8">
            <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
              Categorías
            </div>

            <div className="flex flex-wrap gap-2">
              {(filtros?.categorias || []).map((c) => {
                const active = categoriaSlug === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => onCambiarCategoria(active ? "" : c.slug)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      active
                        ? "bg-[var(--dorado)] text-black border-transparent"
                        : "bg-black/30 text-white/80 border-white/10 hover:border-[var(--dorado)] hover:text-white"
                    }`}
                  >
                    {c.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marcas */}
          <div className="mt-8">
            <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
              Marca
            </div>

            <select
              value={marcaSlug}
              onChange={(e) => onCambiarMarca(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/35 text-white/80 outline-none focus:border-[var(--dorado)] transition"
            >
              <option value="">Todas</option>
              {(filtros?.marcas || []).map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Calibre */}
          <div className="mt-6">
            <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
              Calibre
            </div>

            <select
              value={calibre}
              onChange={(e) => onCambiarCalibre(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/35 text-white/80 outline-none focus:border-[var(--dorado)] transition"
            >
              <option value="">Todos</option>
              {(filtros?.calibres || []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Aumento (ópticas) */}
          {mostrarAumento ? (
            <div className="mt-6">
              <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
                Aumento
              </div>

              <select
                value={aumento}
                onChange={(e) => onCambiarAumento(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/35 text-white/80 outline-none focus:border-[var(--dorado)] transition"
              >
                <option value="">Todos</option>
                {(filtros?.aumentos || []).map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* Precio */}
          <div className="mt-8">
            <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
              Precio
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                value={precioMin}
                onChange={(e) => onCambiarPrecioMin(e.target.value)}
                placeholder="Min"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/35 text-white/80 placeholder:text-white/30 outline-none focus:border-[var(--dorado)] transition"
              />
              <input
                value={precioMax}
                onChange={(e) => onCambiarPrecioMax(e.target.value)}
                placeholder="Max"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/35 text-white/80 placeholder:text-white/30 outline-none focus:border-[var(--dorado)] transition"
              />
            </div>

            {filtros?.precios ? (
              <div className="mt-2 text-xs text-white/40">
                Rango aprox: {Number(filtros.precios.min_precio || 0).toLocaleString("es-AR")} –{" "}
                {Number(filtros.precios.max_precio || 0).toLocaleString("es-AR")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
