import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    document.title = "Gestión de Usuarios | Admin";
  }, []);

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data.usuarios || []))
      .catch((err) => console.error("Error cargando usuarios:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = (id, estadoActual) => {
    fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !estadoActual }),
    }).then((res) => {
      if (res.ok) {
        fetchUsers();
      }
    });
  };

  const changeRole = (id, nuevoRol) => {
    fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol: nuevoRol }),
    }).then((res) => {
      if (res.ok) {
        setUsuarios(
          usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)),
        );
      } else {
        alert("No se pudo cambiar el rol");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-lg p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start">
        <h2 className="text-xl font-bold md:mb-8 text-blue-600">📚 Admin</h2>
        <nav className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-2 text-sm font-medium">
          <Link
            to="/admin"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Dash
          </Link>
          <Link
            to="/admin/books"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Libros
          </Link>
          <Link
            to="/admin/users"
            className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 border-b-2 md:border-b-0 border-blue-600"
          >
            Usuarios
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Control de Usuarios
          </h1>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-gray-200">
            <span className="text-gray-500">Total:</span>{" "}
            <strong>{usuarios.length}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-2 ${u.activo ? "bg-green-500" : "bg-red-500"}`}
              ></div>

              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {u.nombre}
                  </h3>
                  <p className="text-gray-500 text-sm break-all">{u.email}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Rol de acceso
                    </span>
                    <select
                      value={u.rol}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-700"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="bibliotecario">Bibliotecario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    onClick={() => toggleStatus(u.id, u.activo)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                      u.activo
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {u.activo ? "Banear" : "Activar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Nombre
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Email
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Rol
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Estado
                </th>
                <th className="p-4 text-center font-semibold text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-4 font-bold text-gray-800">{u.nombre}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.rol}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="text-xs font-bold bg-white border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="usuario">usuario</option>
                      <option value="bibliotecario">bibliotecario</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${u.activo ? "bg-green-600" : "bg-red-600"}`}
                      ></span>
                      {u.activo ? "Activo" : "Baneado"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(u.id, u.activo)}
                      className={`p-2 rounded-lg transition-transform active:scale-95 ${
                        u.activo
                          ? "hover:bg-red-50 text-red-500"
                          : "hover:bg-green-50 text-green-500"
                      }`}
                      title={u.activo ? "Banear" : "Activar"}
                    >
                      {u.activo ? "🚫" : "✅"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
