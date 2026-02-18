export default function Paginacion({ pagina, total, limite, onCambiarPagina }) {
  const totalPaginas = Math.max(Math.ceil((total || 0) / (limite || 1)), 1);
  const prevDisabled = pagina <= 1;
  const nextDisabled = pagina >= totalPaginas;

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-white/60">
        Página <span className="text-white font-semibold">{pagina}</span> de{" "}
        <span className="text-white font-semibold">{totalPaginas}</span>
      </div>

      <div className="flex gap-2">
        <button
          disabled={prevDisabled}
          onClick={() => onCambiarPagina(pagina - 1)}
          className={`px-5 py-3 rounded-2xl text-sm border transition ${
            prevDisabled
              ? "text-white/30 border-white/10 bg-white/5"
              : "text-white/80 border-white/10 bg-white/5 hover:border-[var(--dorado)] hover:text-white"
          }`}
        >
          Anterior
        </button>

        <button
          disabled={nextDisabled}
          onClick={() => onCambiarPagina(pagina + 1)}
          className={`px-5 py-3 rounded-2xl text-sm border transition ${
            nextDisabled
              ? "text-white/30 border-white/10 bg-white/5"
              : "text-white/80 border-white/10 bg-white/5 hover:border-[var(--dorado)] hover:text-white"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
