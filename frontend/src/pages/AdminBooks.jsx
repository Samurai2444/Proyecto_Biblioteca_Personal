import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminBooks = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [newBook, setNewBook] = useState({
    titulo: "",
    autor: "",
    isbn: "978-84",
    portadaUrl: "",
    descripcion: "",
    anio_publicacion: new Date().getFullYear(),
    categoria_id: 1,
    propietario_id: 3,
    compartido_publico: false,
    estado_publicacion: "publicado",
  });

  useEffect(() => {
    document.title = `Inventario (${libros.length}) | BiblioSRS`;
  }, [libros]);

  const fetchBooks = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/libros`)
      .then((res) => res.json())
      .then((data) => {
        setLibros(data.libros || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openEditModal = (libro) => {
    setBookToEdit({
      ...libro,
      anio_publicacion: libro.anioPublicacion,
      estado_publicacion: libro.estadoPublicacion,
      compartido_publico: libro.compartidoPublico,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/libros/editar/${bookToEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookToEdit),
    }).then(() => {
      fetchBooks();
      setShowEditModal(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro?")) {
      fetch(`${import.meta.env.VITE_API_URL}/libros/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          setLibros(libros.filter((libro) => libro.id !== id));
        }
      });
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/libros/nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchBooks();
        setShowModal(false);
        setNewBook({ titulo: "", autor: "", isbn: "978-84", portadaUrl: "" });
      });
  };

  if (loading) return <div className="p-10 text-center">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-lg p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start">
        <h2 className="text-xl font-bold md:mb-8">📚 Admin</h2>
        <nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 text-sm">
          <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-gray-100">
            Dash
          </Link>
          <Link
            to="/admin/books"
            className="px-3 py-2 rounded-lg bg-gray-100 font-medium border-b-2 md:border-b-0 border-blue-600"
          >
            Libros
          </Link>
          <Link
            to="/admin/users"
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Users
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Inventario</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 md:py-2 rounded-xl hover:bg-blue-700 transition shadow-md font-medium"
          >
            + Añadir Nuevo Libro
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {libros.map((libro) => (
            <div
              key={libro.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex gap-4">
                <img
                  src={
                    libro.portadaUrl ||
                    "https://placehold.co/400x600?text=Sin+Portada"
                  }
                  alt={libro.titulo}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-tight mb-1">
                    {libro.titulo}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">{libro.autor}</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {libro.isbn}
                  </p>
                  <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                    Stock: {libro.ejemplaresTotal} uds.
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => openEditModal(libro)}
                  className="flex-1 py-2 bg-gray-100 text-blue-600 rounded-lg font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(libro.id)}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Portada</th>
                <th className="p-4 text-left">Título y Autor</th>
                <th className="p-4 text-left">ISBN</th>
                <th className="p-4 text-left">Stock total</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {libros.map((libro) => (
                <tr key={libro.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={
                        libro.portadaUrl ||
                        "https://placehold.co/400x600?text=Sin+Portada"
                      }
                      alt={libro.titulo}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{libro.titulo}</p>
                    <p className="text-gray-500 text-xs">{libro.autor}</p>
                  </td>
                  <td className="p-4 text-gray-600 font-mono">{libro.isbn}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                      {libro.ejemplaresTotal} uds.
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(libro)}
                        className="text-blue-600 px-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(libro.id)}
                        className="text-red-600 px-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
            <div className="bg-white rounded-t-3xl md:rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Añadir Nuevo Libro</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="md:hidden text-gray-400 text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border p-3 md:p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={newBook.titulo}
                    onChange={(e) =>
                      setNewBook({ ...newBook, titulo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border p-3 md:p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBook.autor}
                    onChange={(e) =>
                      setNewBook({ ...newBook, autor: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      className="w-full border p-3 md:p-2 rounded-xl font-mono text-sm"
                      value={newBook.isbn}
                      onChange={(e) =>
                        setNewBook({ ...newBook, isbn: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      URL Portada
                    </label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded-lg"
                      placeholder="https://..."
                      value={newBook.portadaUrl}
                      onChange={(e) =>
                        setNewBook({ ...newBook, portadaUrl: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Año
                    </label>
                    <input
                      type="number"
                      className="w-full border p-3 md:p-2 rounded-xl"
                      value={newBook.anio_publicacion}
                      onChange={(e) =>
                        setNewBook({
                          ...newBook,
                          anio_publicacion: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Estado
                    </label>
                    <select
                      className="w-full border p-2 rounded-lg bg-white"
                      value={newBook.estado_publicacion}
                      onChange={(e) =>
                        setNewBook({
                          ...newBook,
                          estado_publicacion: e.target.value,
                        })
                      }
                    >
                      <option value="publicado">Publicado</option>
                      <option value="prestado">Prestado</option>
                      <option value="reservado">Reservado</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Descripción
                    </label>
                    <textarea
                      className="w-full border p-2 rounded-lg"
                      rows="3"
                      value={newBook.descripcion}
                      onChange={(e) =>
                        setNewBook({ ...newBook, descripcion: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publico"
                      checked={newBook.compartido_publico}
                      onChange={(e) =>
                        setNewBook({
                          ...newBook,
                          compartido_publico: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="publico"
                      className="text-sm text-gray-700 font-medium cursor-pointer"
                    >
                      Compartir públicamente
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 md:py-2 rounded-xl font-bold shadow-lg mt-4"
                >
                  Guardar Libro
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full text-gray-400 py-2 hover:text-red-600"
                >
                  Cerrar
                </button>
              </form>
            </div>
          </div>
        )}

        {showEditModal && bookToEdit && (
          <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
            <div className="bg-white rounded-t-3xl md:rounded-2xl p-6 w-full max-w-md border-t-4 border-orange-400">
              <h2 className="text-xl font-bold mb-4 text-orange-600">
                Editar Libro
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  className="w-full border p-3 md:p-2 rounded-xl"
                  value={bookToEdit.titulo}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, titulo: e.target.value })
                  }
                  placeholder="Título"
                />
                <input
                  type="text"
                  className="w-full border p-3 md:p-2 rounded-xl"
                  value={bookToEdit.autor}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, autor: e.target.value })
                  }
                  placeholder="Autor"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 text-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBooks;
