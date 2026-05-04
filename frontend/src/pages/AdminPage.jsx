import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    document.title = "Panel de Control | BiblioSRS";
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/prestamos/activos`)
      .then((res) => res.json())
      .then((data) => setPrestamos(data.prestamos || []));

    fetch(`${import.meta.env.VITE_API_URL}/libros`)
      .then((res) => res.json())
      .then((data) => setLibros(data.libros || []));

    fetch(`${import.meta.env.VITE_API_URL}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data.usuarios || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-lg p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start">
        <h2 className="text-xl font-bold md:mb-8">📚 Admin</h2>
        <nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 text-sm">
          <Link
            to="/admin"
            className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold border-b-2 md:border-b-0 border-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/books"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Libros
          </Link>
          <Link
            to="/admin/users"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Usuarios
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Resumen de Actividad
          </h1>
          <p className="text-sm text-gray-500">
            Bienvenido al panel de control
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">📖</div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Total Libros
              </p>
              <p className="text-2xl font-black text-gray-800">
                {libros.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">👥</div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Usuarios
              </p>
              <p className="text-2xl font-black text-gray-800">
                {usuarios.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 sm:col-span-2 md:col-span-1">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              ⏳
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Préstamos Activos
              </p>
              <p className="text-2xl font-black text-gray-800">
                {prestamos.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
            <h2 className="font-bold text-gray-800">Préstamos en curso</h2>
            <Link
              to="/admin/books"
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
            >
              GESTIONAR STOCK
            </Link>
          </div>

          <div className="block md:hidden divide-y divide-gray-100">
            {prestamos.map((p) => (
              <div
                key={p.id}
                className="p-5 hover:bg-gray-50 transition active:bg-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900 leading-tight">
                    {p.libroTitulo}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono uppercase">
                    {p.ejemplarCodigo}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      👤 {p.usuario?.nombre || "Anónimo"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      📅 Desde: {p.fechaPrestamo}
                    </p>
                  </div>
                  <button className="text-blue-600 text-sm font-bold border border-blue-100 px-3 py-1 rounded-lg">
                    Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 uppercase text-[11px] tracking-widest">
                <tr>
                  <th className="p-4">Título del Libro</th>
                  <th className="p-4">Cód. Ejemplar</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Fecha Inicio</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prestamos.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4 font-bold text-gray-800">
                      {p.libroTitulo}
                    </td>
                    <td className="p-4 text-gray-500 font-mono">
                      {p.ejemplarCodigo}
                    </td>
                    <td className="p-4 text-gray-700">
                      {p.usuario?.nombre || "Anónimo"}
                    </td>
                    <td className="p-4 text-gray-500">{p.fechaPrestamo}</td>
                    <td className="p-4 text-center">
                      <button className="bg-white border border-gray-200 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:border-blue-300 hover:bg-blue-50 transition">
                        GESTIONAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {prestamos.length === 0 && (
            <div className="p-10 text-center">
              <span className="text-4xl">🎉</span>
              <p className="mt-2 text-gray-500 font-medium">
                Todo al día. No hay préstamos pendientes.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
