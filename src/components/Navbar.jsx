import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm transition ${
      isActive
        ? "bg-white/10 text-white border border-white/10"
        : "text-white/70 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/55 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="My Friend Armería"
            className="w-10 h-10 rounded-xl object-cover border border-white/10"
          />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-white">
              My Friend
            </div>
            <div className="text-xs text-[var(--dorado)] tracking-[0.18em]">
              ARMERÍA
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>

          <a
            href="https://wa.me/549XXXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            className="ml-2 px-4 py-2 rounded-xl text-sm bg-[var(--dorado)] text-black font-medium hover:opacity-90 transition"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
