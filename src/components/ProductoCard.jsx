import { Link } from "react-router-dom";

const WHATSAPP_NUM = "549XXXXXXXXXX";

export default function ProductoCard({ p }) {
  const estado = p.estado_stock || "consultar_disponibilidad";
  const esAgotado = estado === "agotado";
  const esConsultar = estado === "consultar_disponibilidad";

  const textoBoton = esAgotado || esConsultar ? "Consultar disponibilidad" : "Consultar por WhatsApp";

  const msg = encodeURIComponent(`Hola! Quiero consultar por: ${p.titulo}`);
  const waLink = `https://wa.me/${WHATSAPP_NUM}?text=${msg}`;

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-black/25 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-[var(--dorado)] transition">
      {/* Badge agotado */}
      {esAgotado ? (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/85 backdrop-blur">
          Agotado
        </div>
      ) : null}

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
            {p.calibre ? ` • ${p.calibre}` : ""}
            {p.aumento && p.categoria_slug === "opticas" ? ` • ${p.aumento}` : ""}
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
          {textoBoton}
        </a>
      </div>
    </div>
  );
}
