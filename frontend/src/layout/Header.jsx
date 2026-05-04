import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
    setMenuAbierto(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/book" className="flex items-center gap-2">
            <span className="text-xl font-black text-blue-600 tracking-tighter">
              📚 BibliotecApp
            </span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/book" className="hover:text-blue-600 transition-colors">
              Catálogo
            </Link>
            {user && (
              <Link
                to="/user"
                className="hover:text-blue-600 transition-colors"
              >
                Mi biblioteca
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 mr-4 border-r pr-4 border-gray-100 text-[10px] font-black uppercase tracking-tighter text-gray-400">
            <Link to="/admin" className="hover:text-black">
              Admin
            </Link>
            <Link to="/library" className="hover:text-black">
              Gestión
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:block">
                
                <span className="text-xs font-bold text-gray-800">
                  {user.nombre}
                </span>
              </div>
              <div
                onClick={() => navigate("/user")}
                className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-full cursor-pointer shadow-md shadow-blue-100 font-bold border-2 border-white"
              >
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:block text-[10px] font-black bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-black bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-100"
            >
              Entrar
            </Link>
          )}

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            <Link
              to="/book"
              className="p-3 text-sm font-bold text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
            >
              📚 Catálogo Completo
            </Link>
            {user && (
              <Link
                to="/user"
                className="p-3 text-sm font-bold text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
              >
                👤 Mi Perfil y Préstamos
              </Link>
            )}
            <div className="h-px bg-gray-100 my-2"></div>
            <Link
              to="/admin"
              className="p-3 text-xs font-bold text-gray-400 uppercase tracking-widest"
            >
              Panel Admin
            </Link>
            <Link
              to="/library"
              className="p-3 text-xs font-bold text-gray-400 uppercase tracking-widest"
            >
              Gestión Biblioteca
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="w-full mt-4 p-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl uppercase tracking-widest"
              >
                Cerrar Sesión
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
