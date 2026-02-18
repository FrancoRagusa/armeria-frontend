import { Link } from "react-router-dom";

const WHATSAPP_NUM = "549XXXXXXXXXX";

export default function ProductoCard({ p }) {
  const msg = encodeURIComponent(`Hola! Quiero consultar por: ${p.titulo}`);
  const waLink = `https://wa.me/${WHATSAPP_NUM}?text=${msg}`;

  return (
    <div className="rounded-[28px] border border-white/10 bg-black/25 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-[var(--dorado)] transition">
      <Link to={`/producto/${p.slug}`} className="block group">
        <div className="aspect-[4/3] bg-black/40 overflow-hidden">
          {p.imagen_principal ? (
            <img
              src={p.imagen_principal}
              alt={p.titulo}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="text-xs text-white/55">
            {p.marca_nombre || "—"} • {p.categoria_nombre || "—"}
          </div>

          <h3 className="mt-2 font-semibold tracking-tight text-white line-clamp-2">
            {p.titulo}
          </h3>

          <div className="mt-3 text-sm text-white/80">
            {p.precio != null
              ? `${Number(p.precio).toLocaleString("es-AR")} ${p.moneda || "ARS"}`
              : "Consultar precio"}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-[var(--dorado)] text-black text-sm font-medium hover:opacity-90 transition"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
