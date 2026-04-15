import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/clienteApi.js";

const BTN_BASE =
  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

const BTN_DARK =
  `${BTN_BASE} bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.28)] active:translate-y-0`;

const BTN_YELLOW =
  `${BTN_BASE} bg-yellow-600 border border-yellow-500 text-black hover:bg-yellow-500 hover:border-yellow-400 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(202,138,4,0.28)] active:translate-y-0`;

const BTN_RED =
  `${BTN_BASE} bg-red-700 border border-red-600 text-white hover:bg-red-600 hover:border-red-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(127,29,29,0.28)] active:translate-y-0`;

const BTN_GREEN =
  `${BTN_BASE} bg-emerald-700 border border-emerald-600 text-white hover:bg-emerald-600 hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(6,95,70,0.28)] active:translate-y-0`;

const INPUT_BASE =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20";

export default function AdminPanel() {
  const nav = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const imgFileInputRef = useRef(null);
  const [imgFile, setImgFile] = useState(null);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);

  const [imgOpen, setImgOpen] = useState(false);
  const [imgProducto, setImgProducto] = useState(null);
  const [imgItems, setImgItems] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newOrden, setNewOrden] = useState(0);

  const pages = useMemo(() => Math.ceil(total / limit) || 1, [total]);

  async function logout() {
    try {
      await api.post("/admin/logout");
    } catch {
      // nada
    } finally {
      nav("/admin", { replace: true });
    }
  }

  async function loadSession() {
    try {
      const { data } = await api.get("/admin/me");
      if (!data?.ok) {
        nav("/admin", { replace: true });
        return false;
      }
      setAdmin(data.admin || null);
      return true;
    } catch {
      nav("/admin", { replace: true });
      return false;
    }
  }

  async function loadProducts(targetPage = page, targetQuery = q) {
    setLoading(true);
    setMsg("");

    try {
      const { data } = await api.get("/admin/productos", {
        params: {
          page: targetPage,
          limit,
          q: targetQuery.trim() || undefined,
        },
      });

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      if (e?.response?.status === 401) {
        await logout();
      } else {
        setMsg(e?.response?.data?.message || "Error cargando productos");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const ok = await loadSession();
      if (!ok) return;

      await loadProducts(1, "");

      if (mounted) setBootLoading(false);
    }

    boot();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bootLoading) return;
    loadProducts(page, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function onSearch(e) {
    e.preventDefault();
    setPage(1);
    await loadProducts(1, q);
  }

  async function clearSearch() {
    setQ("");
    setPage(1);
    await loadProducts(1, "");
  }

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
      await loadProducts(page, q);
    } catch (e2) {
      setMsg(e2?.response?.data?.message || "Error import productos");
    } finally {
      setLoading(false);
    }
  }

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
      await loadProducts(page, q);
    } catch (e2) {
      setMsg(e2?.response?.data?.message || "Error import imágenes");
    } finally {
      setLoading(false);
    }
  }

  async function saveRow(id, patch) {
    try {
      await api.put(`/admin/productos/${id}`, patch);
      setMsg("Cambios guardados correctamente");
      await loadProducts(page, q);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error guardando");
    }
  }

  async function toggleActivoProducto(it) {
    if (!it?.id) return;

    const accion = it.activo ? "desactivar" : "activar";
    const ok = window.confirm(
      `¿Seguro que querés ${accion} este producto?\n\n${it.titulo}`
    );

    if (!ok) return;

    try {
      const { data } = await api.patch(`/admin/productos/${it.id}/toggle-activo`);
      setMsg(
        data?.message ||
          (it.activo
            ? "Producto desactivado correctamente"
            : "Producto activado correctamente")
      );
      await loadProducts(page, q);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error cambiando estado del producto");
    }
  }

  async function openImagenes(it) {
    setImgProducto({ id: it.id, titulo: it.titulo, slug: it.slug });
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

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm text-zinc-400">Cargando panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Panel administrativo</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {admin?.nombre || admin?.email || "Administrador"}
            </p>
          </div>

          <button onClick={logout} className={BTN_DARK}>
            Cerrar sesión
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <form
            onSubmit={onImport}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
          >
            <h2 className="font-semibold text-lg">Importar productos (CSV)</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Subí el archivo con los productos. Esta acción importa solo productos.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onFileChange}
            />

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={onPickFile} className={BTN_DARK}>
                  Seleccionar archivo
                </button>

                <button
                  type="submit"
                  disabled={loading || !file}
                  className={BTN_YELLOW}
                >
                  {loading ? "Importando..." : "Importar"}
                </button>

                {file ? (
                  <button type="button" onClick={clearFile} className={BTN_DARK}>
                    Quitar
                  </button>
                ) : null}
              </div>

              <div className="text-sm text-zinc-400">
                {file ? (
                  <>
                    Archivo: <span className="break-all text-white">{file.name}</span>
                  </>
                ) : (
                  "Ningún archivo seleccionado"
                )}
              </div>
            </div>
          </form>

          <form
            onSubmit={onImportImagenes}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
          >
            <h2 className="text-lg font-semibold">Importar imágenes (CSV)</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Columnas recomendadas: <b>slug</b> + <b>imagen_url</b>.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Las imágenes se vinculan al producto por <b>slug</b> y, si no viene, por{" "}
              <b>título</b>.
            </p>

            <input
              ref={imgFileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImgFileChange}
            />

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={onPickImgFile} className={BTN_DARK}>
                  Seleccionar archivo
                </button>

                <button
                  type="submit"
                  disabled={loading || !imgFile}
                  className={BTN_YELLOW}
                >
                  {loading ? "Importando..." : "Importar"}
                </button>

                {imgFile ? (
                  <button type="button" onClick={clearImgFile} className={BTN_DARK}>
                    Quitar
                  </button>
                ) : null}
              </div>

              <div className="text-sm text-zinc-400">
                {imgFile ? (
                  <>
                    Archivo: <span className="break-all text-white">{imgFile.name}</span>
                  </>
                ) : (
                  "Ningún archivo seleccionado"
                )}
              </div>
            </div>
          </form>

          <form
            onSubmit={onSearch}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
          >
            <h2 className="text-lg font-semibold">Buscar</h2>

            <div className="mt-4 flex flex-col gap-2">
              <input
                className={INPUT_BASE}
                placeholder="Buscar por título o slug"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <div className="flex gap-2">
                <button className={BTN_DARK}>Buscar</button>
                <button
                  type="button"
                  onClick={clearSearch}
                  className={BTN_DARK}
                  disabled={loading || (!q.trim() && page === 1)}
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        </div>

        {msg ? (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
            {msg}
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm text-zinc-400">
              Total: <span className="text-white">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={BTN_DARK}
              >
                Anterior
              </button>

              <div className="text-sm text-zinc-400">
                {page} / {pages}
              </div>

              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                className={BTN_DARK}
              >
                Siguiente
              </button>
            </div>
          </div>

          <table className="min-w-full text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2 pr-3 text-left">ID</th>
                <th className="py-2 pr-3 text-left">Título</th>
                <th className="py-2 pr-3 text-left">Calibre</th>
                <th className="py-2 pr-3 text-left">Precio</th>
                <th className="py-2 pr-3 text-left">Stock</th>
                <th className="py-2 pr-3 text-left">Estado</th>
                <th className="py-2 pr-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <Row
                  key={it.id}
                  it={it}
                  onSave={saveRow}
                  onImagenes={() => openImagenes(it)}
                  onToggleActivo={() => toggleActivoProducto(it)}
                />
              ))}
            </tbody>
          </table>

          {items.length === 0 ? (
            <div className="mt-3 text-sm text-zinc-400">No hay resultados.</div>
          ) : null}
        </div>
      </div>

      {imgOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-zinc-400">Imágenes (URL)</div>
                <h3 className="text-lg font-semibold">
                  #{imgProducto?.id} — {imgProducto?.titulo}
                </h3>
                <div className="mt-1 text-xs text-zinc-500">
                  Vínculo recomendado para CSV: <b>slug</b>
                  {imgProducto?.slug ? (
                    <>
                      {" "}
                      · actual: <span className="text-zinc-300">{imgProducto.slug}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <button onClick={closeImagenes} className={BTN_DARK}>
                Cerrar
              </button>
            </div>

            {imgErr ? (
              <div className="mt-3 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-sm text-red-300">
                {imgErr}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
              <input
                className={`${INPUT_BASE} md:col-span-2`}
                placeholder="Pegá URL de la imagen (https://...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />

              <input
                className={INPUT_BASE}
                placeholder="Orden (0,1,2...)"
                value={newOrden}
                onChange={(e) => setNewOrden(e.target.value)}
              />

              <input
                className={`${INPUT_BASE} md:col-span-2`}
                placeholder="Texto alternativo (opcional)"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
              />

              <button disabled={imgLoading} onClick={addImagen} className={BTN_YELLOW}>
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

function Row({ it, onSave, onImagenes, onToggleActivo }) {
  const [precio, setPrecio] = useState(it.precio ?? "");
  const [estado, setEstado] = useState(it.estado_stock ?? "consultar_disponibilidad");

  useEffect(() => {
    setPrecio(it.precio ?? "");
    setEstado(it.estado_stock ?? "consultar_disponibilidad");
  }, [it.precio, it.estado_stock]);

  return (
    <tr className="border-t border-zinc-900 transition-colors hover:bg-zinc-900/20">
      <td className="py-3 pr-3 text-zinc-400">{it.id}</td>
      <td className="py-3 pr-3">
        <div className="font-medium text-white">{it.titulo}</div>
        <div className="mt-1 text-xs text-zinc-500">{it.slug}</div>
      </td>
      <td className="py-3 pr-3 text-zinc-400">{it.calibre || "-"}</td>
      <td className="py-3 pr-3">
        <input
          className="w-28 rounded-lg border border-zinc-800 bg-zinc-900 p-2 transition-all duration-200 outline-none focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
        />
      </td>
      <td className="py-3 pr-3">
        <select
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 transition-all duration-200 outline-none focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="consultar_disponibilidad">consultar_disponibilidad</option>
          <option value="en_stock">en_stock</option>
          <option value="agotado">agotado</option>
        </select>
      </td>
      <td className="py-3 pr-3">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
            it.activo
              ? "border-emerald-700/60 bg-emerald-950/50 text-emerald-300"
              : "border-red-700/60 bg-red-950/40 text-red-300"
          }`}
        >
          {it.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="py-3 pr-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onSave(it.id, {
                precio: precio === "" ? null : Number(precio),
                estado_stock: estado,
              })
            }
            className={BTN_YELLOW}
          >
            Guardar
          </button>

          <button onClick={onImagenes} className={BTN_DARK}>
            Imágenes
          </button>

          <button
            onClick={onToggleActivo}
            className={it.activo ? BTN_RED : BTN_GREEN}
          >
            {it.activo ? "Desactivar" : "Activar"}
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

  useEffect(() => {
    setOrden(im.orden ?? 0);
    setAlt(im.texto_alternativo ?? "");
    setUrl(im.url ?? "");
  }, [im.orden, im.texto_alternativo, im.url]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg bg-black/40">
          {url ? (
            <img src={url} alt={alt || "img"} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-zinc-500">Sin</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-sm text-white outline-none transition-all duration-200 focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
          />

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <input
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-sm text-white outline-none transition-all duration-200 focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              placeholder="Orden"
            />
            <input
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-sm text-white outline-none transition-all duration-200 focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20 md:col-span-2"
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
              className={BTN_YELLOW}
            >
              Guardar cambios
            </button>

            <button disabled={disabled} onClick={onDelete} className={BTN_DARK}>
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}