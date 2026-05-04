import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const User = () => {
  const { user } = useContext(AuthContext);
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    document.title = "Mi perfil | BiblioSRS";
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}/prestamos`)
        .then((res) => res.json())
        .then((data) => {
          setPrestamos(data.prestamos || []);
          setCargando(false);
        })
        .catch((err) => {
          console.error("Error cargando préstamos del usuario:", err);
          setCargando(false);
        });
    }
  }, [user]);

  if (!user)
    return (
      <div className="p-10 text-center">Inicia sesión para ver tu perfil.</div>
    );
  if (cargando)
    return <div className="p-10 text-center">Cargando tu biblioteca...</div>;

  const pendientes = prestamos.filter((p) => p.estado === "pendiente");
  const enCurso = prestamos.filter((p) => p.estado === "activo");
  const leidos = prestamos.filter((p) => p.estado === "devuelto");

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
            {user.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {user.nombre}
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Panel de lector personal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Total Libros
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {prestamos.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Leídos
            </p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {leidos.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              En curso
            </p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {enCurso.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Pendientes
            </p>
            <p className="text-2xl font-black text-orange-500 mt-1">
              {pendientes.length}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-6 px-1 flex items-center gap-2">
          Mi Lectura <span className="w-8 h-px bg-gray-200"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black mb-5 text-orange-600 uppercase tracking-widest flex justify-between items-center">
              Pendiente <span>⏳</span>
            </h3>
            <div className="space-y-4">
              {pendientes.length > 0 ? (
                pendientes.map((p) => (
                  <div
                    key={p.id}
                    className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 transition-hover hover:shadow-md hover:shadow-orange-100/50"
                  >
                    <p className="font-bold text-gray-800 text-sm">
                      {p.libroTitulo}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black text-orange-400 uppercase">
                        Devolución
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {p.fechaDevolucionPrevista}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  No hay libros pendientes
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black mb-5 text-blue-600 uppercase tracking-widest flex justify-between items-center">
              En curso <span>📖</span>
            </h3>
            <div className="space-y-4">
              {enCurso.length > 0 ? (
                enCurso.map((p) => (
                  <div
                    key={p.id}
                    className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 transition-hover hover:shadow-md hover:shadow-blue-100/50"
                  >
                    <p className="font-bold text-gray-800 text-sm">
                      {p.libroTitulo}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black text-blue-400 uppercase">
                        Desde
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {p.fechaPrestamo}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  No estás leyendo nada ahora
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black mb-5 text-green-600 uppercase tracking-widest flex justify-between items-center">
              Leído <span>✅</span>
            </h3>
            <div className="space-y-4">
              {leidos.length > 0 ? (
                leidos.map((p) => (
                  <div
                    key={p.id}
                    className="bg-green-50/50 p-4 rounded-2xl border border-green-100 transition-hover hover:shadow-md hover:shadow-green-100/50"
                  >
                    <p className="font-bold text-gray-800 text-sm">
                      {p.libroTitulo}
                    </p>
                    <p className="mt-2 text-[10px] font-black text-green-500 uppercase">
                      Completado
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  Aún no has terminado libros
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
