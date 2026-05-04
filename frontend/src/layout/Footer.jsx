import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-sm">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>📚</span> BibliotecApp
            </h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Tu portal digital para la gestión de préstamos y descubrimiento
              literario. Organiza tu lectura, consulta disponibilidad en tiempo
              real y forma parte de nuestra comunidad.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">
                Navegación
              </p>
              <ul className="space-y-3 text-sm font-bold text-gray-500">
                <li>
                  <Link
                    to="/book"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Mi Biblioteca
                  </Link>
                </li>
                <li>
                  <Link
                    to="/library"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Gestión Stock
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">
                Usuario
              </p>
              <ul className="space-y-3 text-sm font-bold text-gray-500">
                <li>
                  <Link
                    to="/user"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Acceso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Administración
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            © 2026 BibliotecApp — Sistema de Gestión Bibliotecaria
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-tighter transition-colors"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-tighter transition-colors"
            >
              Términos de uso
            </a>
            <a
              href="#"
              className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-tighter transition-colors"
            >
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
