// src/pages/AdminPanel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/clienteApi.js";

export default function AdminPanel() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // ---- import productos ----
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  // ---- import imágenes ----
  const imgFileInputRef = useRef(null);
  const [imgFile, setImgFile] = useState(null);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // modal imágenes (manual)
  const [imgOpen, setImgOpen] = useState(false);
  const [imgProducto, setImgProducto] = useState(null); // {id,titulo}
  const [imgItems, setImgItems] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newOrden, setNewOrden] = useState(0);

  const pages = useMemo(() => Math.ceil(total / limit) || 1, [total]);

  function logout() {
    localStorage.removeItem("admin_token");
    nav("/admin");
  }

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const { data } = await api.get("/admin/productos", {
        params: { page, limit, q: q.trim() || undefined },
      });

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      if (e?.response?.status === 401) logout();
      else setMsg(e?.response?.data?.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function onSearch(e) {
    e.preventDefault();
    setPage(1);
    await load();
  }

  // ----------------- IMPORT PRODUCTOS -----------------
  function onPickFile() {
    setMsg("");
    fileInputRef.current?.click();
  }

  function onFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onImport(e) {
    e.preventDefault();
    if (!file) return setMsg("Elegí un CSV primero");

    setLoading(true);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);

      const { data } = await api.post("/admin/import/csv", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(
        `Productos: OK ✅ insertados ${data.inserted} / saltados ${data.skipped} (total ${data.total})`
      );
      clearFile();
      await load();
    } catch (e2) {
      setMsg(e2?.response?.data?.message || "Error import productos");
    } finally {
      setLoading(false);
    }
  }

  // ----------------- IMPORT IMÁGENES -----------------
  function onPickImgFile() {
    setMsg("");
    imgFileInputRef.current?.click();
  }

  function onImgFileChange(e) {
    const f = e.target.files?.[0] || null;
    setImgFile(f);
  }

  function clearImgFile() {
    setImgFile(null);
    if (imgFileInputRef.current) imgFileInputRef.current.value = "";
  }

  async function onImportImagenes(e) {
    e.preventDefault();
    if (!imgFile) return setMsg("Elegí un CSV de imágenes primero");

    setLoading(true);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", imgFile);

      const { data } = await api.post("/admin/import/imagenes", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(
        `Imágenes: OK ✅ insertadas ${data.inserted} / saltadas ${data.skipped} / no_encontradas ${data.notFound} (total ${data.total})`
      );
      clearImgFile();
      // No hace falta load() para el catálogo, pero lo dejo por consistencia
      await load();
    } catch (e2) {
      setMsg(e2?.response?.data?.message || "Error import imágenes");
    } finally {
      setLoading(false);
    }
  }

  async function saveRow(id, patch) {
    try {
      await api.put(`/admin/productos/${id}`, patch);
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error guardando");
    }
  }

  // ---------- imágenes manual por producto ----------
  async function openImagenes(it) {
    setImgProducto({ id: it.id, titulo: it.titulo });
    setImgOpen(true);
    setImgItems([]);
    setImgErr("");
    setNewUrl("");
    setNewAlt("");
    setNewOrden(0);

    setImgLoading(true);
    try {
      const { data } = await api.get(`/admin/productos/${it.id}/imagenes`);
      setImgItems(data.items || []);
    } catch (e) {
      setImgErr(e?.response?.data?.message || "No se pudieron cargar las imágenes");
    } finally {
      setImgLoading(false);
    }
  }

  async function addImagen() {
    if (!imgProducto?.id) return;
    if (!newUrl.trim()) return setImgErr("Pegá una URL válida.");

    setImgLoading(true);
    setImgErr("");
    try {
      const { data } = await api.post(`/admin/productos/${imgProducto.id}/imagenes`, {
        url: newUrl.trim(),
        texto_alternativo: newAlt.trim(),
        orden: Number(newOrden) || 0,
      });
      setImgItems(data.items || []);
      setNewUrl("");
      setNewAlt("");
      setNewOrden(0);
    } catch (e) {
      setImgErr(e?.response?.data?.message || "Error agregando imagen");
    } finally {
      setImgLoading(false);
    }
  }

  async function delImagen(id) {
    if (!id) return;
    setImgLoading(true);
    setImgErr("");
    try {
      const { data } = await api.delete(`/admin/imagenes/${id}`);
      setImgItems(data.items || []);
    } catch (e) {
      setImgErr(e?.response?.data?.message || "Error borrando imagen");
    } finally {
      setImgLoading(false);
    }
  }

  async function updImagen(id, patch) {
    setImgLoading(true);
    setImgErr("");
    try {
      const { data } = await api.put(`/admin/imagenes/${id}`, patch);
      setImgItems(data.items || []);
    } catch (e) {
      setImgErr(e?.response?.data?.message || "Error actualizando imagen");
    } finally {
      setImgLoading(false);
    }
  }

  function closeImagenes() {
    setImgOpen(false);
    setImgProducto(null);
    setImgItems([]);
    setImgErr("");
  }

  return (
    <div className="min-h-screen p-4 text-white bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Panel</h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            Cerrar sesión
          </button>
        </div>

        {/* 2 imports + buscar */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Import productos */}
          <form
            onSubmit={onImport}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h2 className="font-semibold">Importar Productos (CSV)</h2>
            <p className="text-sm text-zinc-400 mt-1">Subí el archivo con los productos.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onFileChange}
            />

            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onPickFile}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  Seleccionar archivo
                </button>

                <button
                  type="submit"
                  disabled={loading || !file}
                  className="px-4 py-2 rounded-xl bg-yellow-600 text-black font-semibold disabled:opacity-60"
                >
                  {loading ? "Importando..." : "Importar"}
                </button>

                {file && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
                  >
                    Quitar
                  </button>
                )}
              </div>

              <div className="text-sm text-zinc-400">
                {file ? (
                  <>
                    Archivo: <span className="text-white break-all">{file.name}</span>
                  </>
                ) : (
                  "Ningún archivo seleccionado"
                )}
              </div>
            </div>
          </form>

          {/* Import imágenes */}
          <form
            onSubmit={onImportImagenes}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h2 className="font-semibold">Importar Imágenes (CSV)</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Columnas: <b>slug</b> o <b>titulo</b> + <b>imagen_url</b> (+ orden/alt opcional)
            </p>

            <input
              ref={imgFileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImgFileChange}
            />

            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onPickImgFile}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  Seleccionar archivo
                </button>

                <button
                  type="submit"
                  disabled={loading || !imgFile}
                  className="px-4 py-2 rounded-xl bg-yellow-600 text-black font-semibold disabled:opacity-60"
                >
                  {loading ? "Importando..." : "Importar"}
                </button>

                {imgFile && (
                  <button
                    type="button"
                    onClick={clearImgFile}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
                  >
                    Quitar
                  </button>
                )}
              </div>

              <div className="text-sm text-zinc-400">
                {imgFile ? (
                  <>
                    Archivo: <span className="text-white break-all">{imgFile.name}</span>
                  </>
                ) : (
                  "Ningún archivo seleccionado"
                )}
              </div>
            </div>
          </form>

          {/* Buscar */}
          <form
            onSubmit={onSearch}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h2 className="font-semibold">Buscar</h2>
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                placeholder="Buscar por título o slug"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                Buscar
              </button>
            </div>
          </form>
        </div>

        {msg && (
          <div className="mt-4 text-sm text-zinc-200 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
            {msg}
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-zinc-400">
              Total: <span className="text-white">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-50"
              >
                Anterior
              </button>
              <div className="text-sm text-zinc-400">
                {page} / {pages}
              </div>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>

          <table className="min-w-full text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="text-left py-2 pr-3">ID</th>
                <th className="text-left py-2 pr-3">Título</th>
                <th className="text-left py-2 pr-3">Calibre</th>
                <th className="text-left py-2 pr-3">Precio</th>
                <th className="text-left py-2 pr-3">Stock</th>
                <th className="text-left py-2 pr-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <Row key={it.id} it={it} onSave={saveRow} onImagenes={() => openImagenes(it)} />
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <div className="text-zinc-400 text-sm mt-3">No hay resultados.</div>
          )}
        </div>
      </div>

      {/* MODAL IMÁGENES (manual) */}
      {imgOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-zinc-400">Imágenes (URL)</div>
                <h3 className="text-lg font-semibold">
                  #{imgProducto?.id} — {imgProducto?.titulo}
                </h3>
              </div>
              <button
                onClick={closeImagenes}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                Cerrar
              </button>
            </div>

            {imgErr ? (
              <div className="mt-3 text-sm text-red-300 bg-red-950/30 border border-red-900/40 p-3 rounded-xl">
                {imgErr}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                className="md:col-span-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                placeholder="Pegá URL de la imagen (https://...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <input
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                placeholder="Orden (0,1,2...)"
                value={newOrden}
                onChange={(e) => setNewOrden(e.target.value)}
              />
              <input
                className="md:col-span-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                placeholder="Texto alternativo (opcional)"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
              />
              <button
                disabled={imgLoading}
                onClick={addImagen}
                className="px-4 py-2 rounded-xl bg-yellow-600 text-black font-semibold disabled:opacity-60"
              >
                {imgLoading ? "Guardando..." : "Agregar"}
              </button>
            </div>

            <div className="mt-4 border-t border-zinc-900 pt-4">
              {imgLoading && imgItems.length === 0 ? (
                <div className="text-sm text-zinc-400">Cargando...</div>
              ) : imgItems.length === 0 ? (
                <div className="text-sm text-zinc-400">Sin imágenes todavía.</div>
              ) : (
                <div className="space-y-3">
                  {imgItems.map((im) => (
                    <ImagenRow
                      key={im.id}
                      im={im}
                      onDelete={() => delImagen(im.id)}
                      onUpdate={(patch) => updImagen(im.id, patch)}
                      disabled={imgLoading}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-zinc-500">
              Tip: la imagen con <b>orden más chico</b> queda como principal en el catálogo.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ it, onSave, onImagenes }) {
  const [precio, setPrecio] = useState(it.precio ?? "");
  const [estado, setEstado] = useState(it.estado_stock ?? "consultar_disponibilidad");

  return (
    <tr className="border-t border-zinc-900">
      <td className="py-2 pr-3 text-zinc-400">{it.id}</td>
      <td className="py-2 pr-3">{it.titulo}</td>
      <td className="py-2 pr-3 text-zinc-400">{it.calibre || "-"}</td>
      <td className="py-2 pr-3">
        <input
          className="w-28 p-2 rounded-lg bg-zinc-900 border border-zinc-800"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
        />
      </td>
      <td className="py-2 pr-3">
        <select
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="consultar_disponibilidad">consultar_disponibilidad</option>
          <option value="en_stock">en_stock</option>
          <option value="agotado">agotado</option>
        </select>
      </td>
      <td className="py-2 pr-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onSave(it.id, {
                precio: precio === "" ? null : Number(precio),
                estado_stock: estado,
              })
            }
            className="px-3 py-2 rounded-xl bg-yellow-600 text-black font-semibold"
          >
            Guardar
          </button>

          <button
            onClick={onImagenes}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            Imágenes
          </button>
        </div>
      </td>
    </tr>
  );
}

function ImagenRow({ im, onDelete, onUpdate, disabled }) {
  const [orden, setOrden] = useState(im.orden ?? 0);
  const [alt, setAlt] = useState(im.texto_alternativo ?? "");
  const [url, setUrl] = useState(im.url ?? "");

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-start gap-3">
        <div className="w-24 h-16 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
          {url ? (
            <img src={url} alt={alt || "img"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-zinc-500">Sin</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              placeholder="Orden"
            />
            <input
              className="md:col-span-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Alt (opcional)"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              disabled={disabled}
              onClick={() =>
                onUpdate({
                  url: url.trim(),
                  texto_alternativo: alt.trim(),
                  orden: Number(orden) || 0,
                })
              }
              className="px-3 py-2 rounded-xl bg-yellow-600 text-black font-semibold disabled:opacity-60"
            >
              Guardar cambios
            </button>

            <button
              disabled={disabled}
              onClick={onDelete}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 disabled:opacity-60"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}