import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BookList = () => {
  console.log("¡EL COMPONENTE BOOKLIST SE ESTÁ EJECUTANDO!");

  const [libros, setLibros] = useState([]);

  useEffect(() => {
      document.title = `BiblioSRS | Catálogo`;
    }, []);

  useEffect(() => {
    console.log("Iniciando petición al backend...");

    fetch(`${import.meta.env.VITE_API_URL}/libros`)
      .then((response) => {
        console.log("Estado de la respuesta:", response.status);
        if (!response.ok)
          throw new Error("Error en el servidor: " + response.status);
        return response.json();
      })
      .then((data) => {
        console.log("¡DATOS LLEGARON!", data);
        const listaLimpia = Array.isArray(data) ? data : data.libros || [];
        setLibros(listaLimpia);
      })
      .catch((err) => {
        console.error("EL FETCH HA FALLADO:", err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Explorar Catálogo
        </h1>
        <p className="text-sm text-gray-500">
          {libros.length} libros encontrados
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {libros.map((libro) => (
          <Link to={`/book/${libro.id}`} key={libro.id} className="group">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
                <img
                  src={
                    libro.portadaUrl ||
                    "https://placehold.co/400x600?text=Sin+Portada"
                  }
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  alt={libro.titulo}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x600?text=Error+Imagen";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${
                      libro.ejemplaresDisponibles > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {libro.ejemplaresDisponibles > 0 ? "DISPONIBLE" : "AGOTADO"}
                  </span>
                </div>
              </div>

              <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h2 className="font-bold text-sm md:text-base text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  {libro.titulo}
                </h2>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {libro.autor}
                </p>

                <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
                  <span className="text-[10px] md:text-xs font-medium text-gray-400">
                    {libro.anioPublicacion}
                  </span>
                  <span className="hidden md:block text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                    Leer más →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {libros.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">Cargando biblioteca...</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
