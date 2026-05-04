import React, { useEffect, useState } from "react";

const LibraryPage = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    prestados: 0,
    retrasos: 0,
  });
  const [libros, setLibros] = useState([]);

  useEffect(() => {
      document.title = "Panel de Bibliotecario | BiblioSRS";
    }, []);
  
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/prestamos/activos`).then((res) =>
        res.json(),
      ),
      fetch(`${import.meta.env.VITE_API_URL}/libros`).then((res) => res.json()),
    ])
      .then(([dataPrestamos, dataLibros]) => {
        const listaPrestamos = dataPrestamos.prestamos || [];
        const listaLibros = dataLibros.libros || [];

        setPrestamos(listaPrestamos);
        setLibros(listaLibros);

        const totalEjemplares = listaLibros.reduce(
          (acc, b) => acc + (b.ejemplaresTotal || 0),
          0,
        );
        const disponibles = listaLibros.reduce(
          (acc, b) => acc + (b.ejemplaresDisponibles || 0),
          0,
        );

        setStats({
          total: totalEjemplares,
          disponibles: disponibles,
          prestados: listaPrestamos.length,
        });
      })
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Gestión de biblioteca
          </h1>
          <div className="px-4 py-1 bg-white rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-200 uppercase tracking-widest">
            Bibliotecario
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Ejemplares Totales
            </p>
            <p className="text-3xl font-black text-gray-900 mt-1">
              {stats.total}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Disponibles
            </p>
            <p className="text-3xl font-black text-green-600 mt-1">
              {stats.disponibles}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              En Préstamo
            </p>
            <p className="text-3xl font-black text-orange-500 mt-1">
              {stats.prestados}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 text-lg">
              Préstamos activos{" "}
              <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-lg text-gray-500">
                {prestamos.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 border-b">Libro</th>
                  <th className="p-4 border-b">Código</th>
                  <th className="p-4 border-b">Usuario</th>
                  <th className="p-4 border-b">Fecha Préstamo</th>
                  <th className="p-4 border-b">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {prestamos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800 border-b">
                      {p.libroTitulo || "Sin título"}
                    </td>
                    <td className="p-4 text-gray-500 font-mono border-b">
                      {p.ejemplarCodigo}
                    </td>
                    <td className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {p.usuario?.nombre?.charAt(0) || "U"}
                        </div>
                        {p.usuario?.nombre || "Anónimo"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 border-b">
                      {p.fechaPrestamo}
                    </td>
                    <td className="p-4 border-b">
                      <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-orange-100">
                        Prestado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-6">
            Estado de stock por libro
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {libros.slice(0, 8).map((libro) => (
              <div
                key={libro.id}
                className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
              >
                <p className="font-bold text-gray-900 text-sm truncate mb-1">
                  {libro.titulo}
                </p>
                <div className="flex justify-between items-end mt-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      Total Stock
                    </p>
                    <p className="text-sm font-black text-gray-700">
                      {libro.ejemplaresTotal}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[10px] font-black uppercase tracking-tighter ${libro.ejemplaresDisponibles > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {libro.ejemplaresDisponibles > 0
                        ? "Disponible"
                        : "Agotado"}
                    </p>
                    <p
                      className={`text-sm font-black ${libro.ejemplaresDisponibles > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {libro.ejemplaresDisponibles} u.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
