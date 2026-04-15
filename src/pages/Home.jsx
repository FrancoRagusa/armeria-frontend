import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const WHATSAPP = "5491159454757";

const CATEGORIAS_DESTACADAS = [
  { nombre: "Arma corta", slug: "arma-corta" },
  { nombre: "Arma larga", slug: "arma-larga" },
  { nombre: "Ópticas", slug: "opticas" },
  { nombre: "Municiones", slug: "municiones" },
  { nombre: "Accesorios", slug: "accesorios" },
  { nombre: "Promociones", slug: "promociones" },
];

const NOVEDADES = [
  { nombre: "Glock", slug: "glock" },
  { nombre: "Tikka", slug: "tikka" },
  { nombre: "Steyr", slug: "steyr" },
  { nombre: "Ruger", slug: "ruger" },
  { nombre: "Sig Sauer", slug: "sig-sauer" },
];

const MARCAS = [
  { nombre: "Bersa", slug: "bersa" },
  { nombre: "Glock", slug: "glock" },
  { nombre: "CZ", slug: "cz" },
  { nombre: "Magtech", slug: "magtech" },
  { nombre: "Remington", slug: "remington" },
  { nombre: "Smith & Wesson", slug: "smith-wesson" },
  { nombre: "Beretta", slug: "beretta" },
  { nombre: "Marlin", slug: "marlin" },
];

export default function Home() {
  const waMsg = encodeURIComponent("Hola! Quiero consultar por productos del catálogo.");
  const waLink = `https://wa.me/${WHATSAPP}?text=${waMsg}`;

  return (
    <div className="bg-[var(--fondo)]">
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16 text-white">
        {/* HERO PREMIUM */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[var(--panel)] shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl bg-[var(--dorado)]/20" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl bg-white/5" />
          </div>

          <div className="relative p-10 md:p-16">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="My Friend Armería"
                className="w-16 h-16 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <div className="text-[var(--dorado)] font-semibold text-xl">My Friend</div>
                <div className="text-xs text-white/60 tracking-[0.25em]">ARMERÍA</div>
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
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-white">Categorías destacadas</h2>
              <p className="text-white/60 mt-2 text-sm">
                Accedé rápido a las categorías principales del catálogo.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="text-sm text-[var(--dorado)] hover:opacity-80 transition"
            >
              Ver catálogo →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIAS_DESTACADAS.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria_slug=${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-6 md:p-8 hover:border-[var(--dorado)] hover:bg-black/45 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 pointer-events-none" />
                <h3 className="relative text-lg md:text-xl font-semibold text-white group-hover:text-[var(--dorado)] transition">
                  {cat.nombre}
                </h3>
                <p className="relative text-white/60 text-sm mt-2">Ver productos disponibles</p>
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
                Marcas destacadas seleccionadas por el local.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="text-sm text-[var(--dorado)] hover:opacity-80 transition"
            >
              Ver todo →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {NOVEDADES.map((marca) => (
              <Link
                key={marca.slug}
                to={`/catalogo?marca_slug=${marca.slug}`}
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-5 text-center hover:border-[var(--dorado)] hover:bg-black/45 transition"
              >
                <div className="text-white font-medium">{marca.nombre}</div>
                <div className="text-xs text-white/60 mt-1">Ver productos</div>
              </Link>
            ))}
          </div>
        </section>

        {/* MARCAS */}
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

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MARCAS.map((marca) => (
              <Link
                key={marca.slug}
                to={`/catalogo?marca_slug=${marca.slug}`}
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-center hover:border-[var(--dorado)] hover:bg-black/45 transition"
              >
                <div className="text-white font-medium">{marca.nombre}</div>
                <div className="text-xs text-white/60 mt-1">Ver productos</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center rounded-[28px] border border-white/10 bg-[var(--panel)] p-10">
          <h2 className="text-2xl font-semibold text-white">¿Buscás algo específico?</h2>

          <p className="text-white/60 mt-3">Contactanos directamente y te asesoramos.</p>

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

        {/* NUESTRO LOCAL */}
        <section className="mt-24">
          <div className="rounded-[32px] border border-white/10 bg-black/20 p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs font-semibold text-white/50 tracking-[0.2em] uppercase">
                  Nuestro Local
                </div>

                <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                  Atención personalizada en nuestro showroom
                </h2>

                <p className="mt-5 text-white/60 leading-relaxed">
                  Te esperamos en nuestro local para asesorarte personalmente. Podés
                  consultar disponibilidad, recibir recomendaciones y ver productos en
                  persona.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-[0.18em]">
                      Dirección
                    </div>
                    <div className="mt-1 text-lg font-medium text-white">Paraguay 1371</div>

                    <a
                      href="https://maps.app.goo.gl/jewnDC7pXX1fEgSn9?g_st=iw"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-[var(--dorado)] text-sm hover:opacity-80 transition"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-[0.18em]">
                      Horarios
                    </div>
                    <div className="mt-1 text-lg font-medium text-white">10:30 a 18:00</div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                  <div className="aspect-[4/3]">
                    <iframe
                      title="Mapa Paraguay 1371"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps?q=Paraguay%201371&output=embed"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--dorado)]/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}