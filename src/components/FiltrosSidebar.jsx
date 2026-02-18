export default function FiltrosSidebar({
  filtros,
  categoriaSlug,
  marcaSlug,
  onCambiarCategoria,
  onCambiarMarca,
  onLimpiar,
}) {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Filtros</h2>
        <button
          onClick={onLimpiar}
          className="text-xs text-white/60 hover:text-[var(--dorado)] transition"
        >
          Limpiar
        </button>
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
          Categorías
        </div>

        <div className="space-y-2">
          {(filtros?.categorias || []).map((c) => (
            <button
              key={c.slug}
              onClick={() => onCambiarCategoria(c.slug)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm border transition ${
                categoriaSlug === c.slug
                  ? "bg-[var(--dorado)] text-black border-transparent"
                  : "bg-black/35 text-white/80 border-white/10 hover:border-[var(--dorado)] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.nombre}</span>
                {typeof c.cantidad === "number" ? (
                  <span
                    className={`text-xs ${
                      categoriaSlug === c.slug ? "text-black/70" : "text-white/50"
                    }`}
                  >
                    {c.cantidad}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-xs font-semibold text-white/50 mb-3 tracking-[0.18em] uppercase">
          Marcas
        </div>

        <div className="space-y-2">
          {(filtros?.marcas || []).map((m) => (
            <button
              key={m.slug}
              onClick={() => onCambiarMarca(m.slug)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm border transition ${
                marcaSlug === m.slug
                  ? "bg-[var(--dorado)] text-black border-transparent"
                  : "bg-black/35 text-white/80 border-white/10 hover:border-[var(--dorado)] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{m.nombre}</span>
                {typeof m.cantidad === "number" ? (
                  <span
                    className={`text-xs ${
                      marcaSlug === m.slug ? "text-black/70" : "text-white/50"
                    }`}
                  >
                    {m.cantidad}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
