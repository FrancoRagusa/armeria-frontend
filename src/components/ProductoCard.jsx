import { Link } from "react-router-dom";

const WHATSAPP_NUM = "549XXXXXXXXXX";

export default function ProductoCard({ p }) {
  const estado = p.estado_stock || "consultar_disponibilidad";
  const esAgotado = estado === "agotado";
  const esConsultar = estado === "consultar_disponibilidad";

  const textoBoton =
    esAgotado || esConsultar ? "Consultar disponibilidad" : "Consultar por WhatsApp";

  const msg = encodeURIComponent(`Hola! Quiero consultar por: ${p.titulo}`);
  const waLink = `https://wa.me/${WHATSAPP_NUM}?text=${msg}`;

  const precioNumero =
    p?.precio === null || p?.precio === undefined || p?.precio === ""
      ? null
      : Number(p.precio);

  const mostrarPrecio =
    Number.isFinite(precioNumero) && precioNumero > 0;

  const precioTexto = mostrarPrecio
    ? `${precioNumero.toLocaleString("es-AR")} ${p.moneda || "ARS"}`
    : "Consultar precio";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/25 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-[var(--dorado)]">
      {esAgotado ? (
        <div className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
          Agotado
        </div>
      ) : null}

      <Link to={`/producto/${p.slug}`} className="block group">
        <div className="aspect-[4/3] overflow-hidden bg-black/40">
          {p.imagen_principal ? (
            <img
              src={p.imagen_principal}
              alt={p.titulo}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
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

          <h3 className="mt-2 line-clamp-2 font-semibold tracking-tight text-white">
            {p.titulo}
          </h3>

          <div
            className={`mt-3 text-sm ${
              mostrarPrecio ? "text-white/80" : "font-medium text-white/60"
            }`}
          >
            {precioTexto}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--dorado)] px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          {textoBoton}
        </a>
      </div>
    </div>
  );
}