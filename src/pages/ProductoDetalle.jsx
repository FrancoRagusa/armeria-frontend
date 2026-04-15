// src/pages/ProductoDetalle.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/clienteApi.js";

const WHATSAPP_NUM = "549XXXXXXXXXX";

export default function ProductoDetalle() {
  const { slug } = useParams();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError("");

      try {
        const r = await api.get(`/productos/${slug}`);
        if (cancelado) return;

        const prod = r.data?.producto || null;
        const imgs = r.data?.imagenes || [];

        setProducto(prod);
        setImagenes(imgs);
        setImagenActiva(0);
      } catch (e) {
        if (cancelado) return;
        setError("No se pudo cargar el producto.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [slug]);

  const waLink = useMemo(() => {
    if (!producto) return "#";
    const waMsg = encodeURIComponent(`Hola! Quiero consultar por: ${producto.titulo}`);
    return `https://wa.me/${WHATSAPP_NUM}?text=${waMsg}`;
  }, [producto]);

  const imagenPrincipal = imagenes?.[imagenActiva]?.url || null;

  if (cargando) {
    return (
      <main className="bg-[var(--fondo)] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-6 text-white/70">
            Cargando producto...
          </div>
        </div>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="bg-[var(--fondo)] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-6 text-white/80">
            {error || "Producto no encontrado"}
            <div className="mt-4">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-black/30 text-white/80 hover:border-[var(--dorado)] hover:text-white transition"
              >
                ← Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const mostrarPrecio =
    producto.precio != null && Number(producto.precio) > 0
      ? `${Number(producto.precio).toLocaleString("es-AR")} ${producto.moneda || "ARS"}`
      : "Consultar precio";

  return (
    <main className="bg-[var(--fondo)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 text-white">
        <div className="mb-6">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-black/25 text-white/75 hover:border-[var(--dorado)] hover:text-white transition"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/20 p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            {/* Columna imágenes */}
            <div>
              <div className="rounded-[28px] overflow-hidden border border-white/10 bg-white/5">
                <div className="aspect-[4/3] bg-[#111] flex items-center justify-center">
                  {imagenPrincipal ? (
                    <img
                      src={imagenPrincipal}
                      alt={producto.titulo}
                      className="w-full h-full object-contain bg-[#e9e9e9]"
                    />
                  ) : (
                    <div className="text-white/35 text-sm">Sin imagen</div>
                  )}
                </div>
              </div>

              {imagenes.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {imagenes.slice(0, 10).map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setImagenActiva(idx)}
                      className={`rounded-2xl overflow-hidden border transition ${
                        idx === imagenActiva
                          ? "border-[var(--dorado)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="aspect-square bg-[#111]">
                        <img
                          src={img.url}
                          alt={img.texto_alternativo || producto.titulo}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Columna info */}
            <div className="pt-1">
              <div className="text-sm text-white/55">
                {producto.marca_nombre || "—"} • {producto.categoria_nombre || "—"}
                {producto.calibre ? ` • ${producto.calibre}` : ""}
                {producto.aumento ? ` • ${producto.aumento}` : ""}
              </div>

              <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
                {producto.titulo}
              </h1>

              <div className="mt-5 text-2xl md:text-3xl font-semibold text-[var(--dorado)]">
                {mostrarPrecio}
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-white/10 bg-white/5 text-white/75">
                  {producto.estado_stock === "agotado"
                    ? "Agotado"
                    : producto.estado_stock === "en_stock"
                    ? "En stock"
                    : "Consultar disponibilidad"}
                </span>
              </div>

              {producto.descripcion ? (
                <div className="mt-6 rounded-[24px] border border-white/10 bg-black/25 p-5">
                  <h2 className="text-sm uppercase tracking-[0.18em] text-white/45 font-semibold">
                    Descripción
                  </h2>
                  <p className="mt-3 text-white/80 leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
                >
                  Consultar por WhatsApp
                </a>

                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-white/10 bg-black/25 text-white/85 hover:border-white/25 hover:text-white transition"
                >
                  Seguir viendo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}