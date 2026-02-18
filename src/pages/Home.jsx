import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const WHATSAPP = "549XXXXXXXXXX";

export default function Home() {
  const waMsg = encodeURIComponent("Hola! Quiero consultar por productos del catálogo.");
  const waLink = `https://wa.me/${WHATSAPP}?text=${waMsg}`;

  return (
    // Fondo oscuro forzado para toda la página
    <div className="bg-[var(--fondo)]">
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16 text-white">

        {/* HERO PREMIUM */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[var(--panel)] shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl bg-[var(--dorado)]/20" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl bg-white/5" />
          </div>

          <div className="relative p-10 md:p-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="My Friend Armería"
                className="w-16 h-16 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <div className="text-[var(--dorado)] font-semibold text-xl">
                  My Friend
                </div>
                <div className="text-xs text-white/60 tracking-[0.25em]">
                  ARMERÍA
                </div>
              </div>
            </div>

            <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
              Tradición, precisión
              <br />
              <span className="text-[var(--dorado)]">y confianza</span>
            </h1>

            <p className="mt-6 text-white/70 max-w-2xl leading-relaxed">
              Explorá nuestro catálogo de productos organizados por categorías y marcas.
              Atención personalizada y consulta directa por WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="px-7 py-3 rounded-2xl bg-[var(--dorado)] text-black text-sm font-medium hover:opacity-90 transition"
              >
                Ver catálogo
              </Link>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 rounded-2xl bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15 transition"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS DESTACADAS */}
        <section className="rounded-[28px] border border-white/10 bg-black/25 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Categorías destacadas
          </h2>
          <p className="text-white/60 mt-2 text-sm">
            Accedé rápido a las secciones principales del catálogo.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Pistolas", "Rifles", "Ópticas"].map((cat) => (
              <Link
                key={cat}
                to="/catalogo"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-8 hover:border-[var(--dorado)] transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 pointer-events-none" />
                <h3 className="relative text-xl font-semibold text-white group-hover:text-[var(--dorado)] transition">
                  {cat}
                </h3>
                <p className="relative text-white/60 text-sm mt-2">
                  Ver productos disponibles
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* NOVEDADES */}
        <section className="rounded-[28px] border border-white/10 bg-black/25 p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-white">Novedades</h2>
              <p className="text-white/60 mt-2 text-sm">
                Productos destacados (después lo conectamos al backend).
              </p>
            </div>

            <Link
              to="/catalogo"
              className="text-sm text-[var(--dorado)] hover:opacity-80 transition"
            >
              Ver todo →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-black/35 p-6"
              >
                <div className="aspect-[4/3] bg-white/5 rounded-2xl mb-4" />
                <div className="text-white font-medium">Producto destacado</div>
                <div className="text-white/60 text-sm mt-1">
                  Próximamente conectado al backend.
                </div>

                <div className="mt-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15 transition"
                  >
                    Consultar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARCAS (ARREGLADO PREMIUM REAL) */}
        <section className="rounded-[28px] border border-white/10 bg-black/25 p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-white">Marcas</h2>
              <p className="text-white/60 mt-2 text-sm">
                Selección de marcas destacadas. Consultá disponibilidad por WhatsApp.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="text-sm text-[var(--dorado)] hover:opacity-80 transition"
            >
              Ver catálogo →
            </Link>
          </div>

          {/* En vez de “chips grises”, hacemos “badges” premium */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {["Bersa", "Glock", "CZ", "Stoeger", "Magtech", "Umarex", "Remington", "Puma"].map(
              (marca) => (
                <div
                  key={marca}
                  className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-center
                             hover:border-[var(--dorado)] hover:bg-black/45 transition"
                >
                  <div className="text-white font-medium">{marca}</div>
                  <div className="text-xs text-white/60 mt-1">Ver productos</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center rounded-[28px] border border-white/10 bg-[var(--panel)] p-10">
          <h2 className="text-2xl font-semibold text-white">
            ¿Buscás algo específico?
          </h2>

          <p className="text-white/60 mt-3">
            Contactanos directamente y te asesoramos.
          </p>

          <div className="mt-6">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3 rounded-2xl bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
