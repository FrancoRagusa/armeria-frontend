import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/clienteApi.js";

export default function ProductoDetalle() {
  const { slug } = useParams();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError("");
      try {
        const r = await api.get(`/productos/${slug}`);
        if (cancelado) return;
        setProducto(r.data?.producto || null);
        setImagenes(r.data?.imagenes || []);
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

  if (cargando) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl bg-white border border-zinc-200 p-6">Cargando...</div>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl bg-white border border-zinc-200 p-6">
          {error || "Producto no encontrado"} • <Link className="underline" to="/catalogo">Volver</Link>
        </div>
      </main>
    );
  }

  const waMsg = encodeURIComponent(`Hola! Quiero consultar por: ${producto.titulo}`);
  const waLink = `https://wa.me/549XXXXXXXXXX?text=${waMsg}`;

  const imagenPrincipal = imagenes?.[0]?.url || null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/catalogo" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-sm">
          <div className="aspect-[4/3] bg-zinc-100">
            {imagenPrincipal ? (
              <img src={imagenPrincipal} alt={producto.titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                Sin imagen
              </div>
            )}
          </div>

          {imagenes.length > 1 ? (
            <div className="p-4 grid grid-cols-4 gap-2">
              {imagenes.slice(0, 8).map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.texto_alternativo || producto.titulo}
                  className="aspect-square object-cover rounded-xl border border-zinc-200"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-sm text-zinc-500">
            {producto.marca_nombre || "—"} • {producto.categoria_nombre || "—"}
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{producto.titulo}</h1>

          {producto.precio != null ? (
            <div className="mt-4 text-xl">
              {Number(producto.precio).toLocaleString("es-AR")} {producto.moneda || "ARS"}
            </div>
          ) : null}

          {producto.descripcion ? (
            <p className="mt-4 text-zinc-700 leading-relaxed">{producto.descripcion}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-zinc-900 text-white text-sm hover:opacity-90 transition"
            >
              Consultar por WhatsApp
            </a>

            <Link
              to="/catalogo"
              className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-900 text-sm hover:bg-zinc-200 transition"
            >
              Seguir viendo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
