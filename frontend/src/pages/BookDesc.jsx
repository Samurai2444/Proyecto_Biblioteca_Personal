import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDesc = () => {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    document.title = `Descripcion del libro | BiblioSRS`;
  }, []);

  const handlePublicar = () => {
    if (!nuevoTexto.trim()) return;

    const userId = localStorage.getItem("userId") || 1;

    fetch(`${import.meta.env.VITE_API_URL}/libros/${id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contenido: nuevoTexto,
        usuario_id: userId,
        parent_id: replyTo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (replyTo) {
          setComentarios(
            comentarios.map((c) =>
              c.id === replyTo
                ? { ...c, respuestas: [...(c.respuestas || []), data] }
                : c,
            ),
          );
        } else {
          setComentarios([data, ...comentarios]);
        }

        setNuevoTexto("");
        setReplyTo(null);
      });
  };

  const handleBorrar = (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este comentario?"))
      return;

    fetch(`${import.meta.env.VITE_API_URL}/comentarios/${commentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          const nuevosComentarios = comentarios
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              respuestas: c.respuestas
                ? c.respuestas.filter((r) => r.id !== commentId)
                : [],
            }));

          setComentarios(nuevosComentarios);
        }
      })
      .catch((err) => console.error("Error al borrar:", err));
  };

  const handlePrestar = () => {
    const userId = localStorage.getItem("userId") || 1;

    if (
      window.confirm(`¿Quieres solicitar un préstamo de "${libro?.titulo}"?`)
    ) {
      fetch(`${import.meta.env.VITE_API_URL}/libros/${id}/prestar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(`${data.message}\nDevolución: ${data.fechaDevolucion}`);
            window.location.reload();
          }
        })
        .catch((err) => console.error("Error al procesar préstamo:", err));
    }
  };

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/libros/${id}`).then((res) => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/libros/${id}/comentarios`).then((res) =>
        res.json(),
      ),
    ])
      .then(([dataLibro, dataComents]) => {
        setLibro(dataLibro);
        setComentarios(dataComents.comentarios || []);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando página:", err);
        setCargando(false);
      });
  }, [id]);

  if (cargando)
    return (
      <div className="p-10 text-center">Cargando detalles del libro...</div>
    );
  if (!libro)
    return <div className="p-10 text-center">Libro no encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start text-center md:text-left">
          <img
            src={
              libro.portada || "https://placehold.co/400x600?text=Sin+Portada"
            }
            className="w-48 md:w-64 h-auto aspect-[2/3] object-cover rounded-2xl shadow-xl border-4 border-white"
            alt={libro.titulo}
          />

          <div className="flex-1 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
              {libro.titulo}
            </h1>
            <p className="text-lg text-gray-500 mt-2 font-medium">
              {libro.autor} · {libro.anioPublicacion}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {libro.categoria && (
                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {libro.categoria.nombre}
                </span>
              )}
              {libro.etiquetas?.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold"
                >
                  #{tag.nombre}
                </span>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm inline-block w-full md:w-auto">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {libro.ejemplaresDisponibles > 0 ? (
                  <button
                    onClick={handlePrestar}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-200"
                  >
                    📖 Tomar prestado
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full md:w-auto bg-gray-100 text-gray-400 px-8 py-3 rounded-xl font-bold border border-gray-200 cursor-not-allowed"
                  >
                    🚫 Agotado
                  </button>
                )}
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                    Disponibilidad
                  </p>
                  <p
                    className={`font-black ${libro.ejemplaresDisponibles > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {libro.ejemplaresDisponibles} / {libro.ejemplaresTotal}{" "}
                    unidades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            Sinopsis
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            {libro.descripcion || "Sin descripción disponible."}
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            Comunidad{" "}
            <span className="text-sm bg-gray-200 px-2 py-0.5 rounded-lg">
              {comentarios.length}
            </span>
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            {replyTo && (
              <div className="bg-blue-600 text-white px-4 py-2 text-xs flex justify-between items-center font-bold">
                <span>Respondiendo a hilo #{replyTo}</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="underline uppercase tracking-tighter"
                >
                  Cancelar
                </button>
              </div>
            )}
            <textarea
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Escribe tu opinión aquí..."
              className="w-full border-none p-4 text-sm focus:ring-0 min-h-[100px]"
            />
            <div className="p-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={handlePublicar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
              >
                Publicar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {comentarios.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-300 text-white rounded-full flex items-center justify-center font-bold">
                      {c.autor?.nombre?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {c.autor?.nombre || "Anónimo"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                        {new Date(c.creadoEn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBorrar(c.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                  {c.contenido}
                </p>

                <button
                  onClick={() => {
                    setReplyTo(c.id);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className="mt-4 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition"
                >
                  ↩ RESPONDER
                </button>

                {c.respuestas?.length > 0 && (
                  <div className="mt-4 ml-6 md:ml-10 space-y-3 border-l-2 border-blue-50 pl-4 md:pl-6">
                    {c.respuestas.map((rep) => (
                      <div
                        key={rep.id}
                        className="bg-gray-50 p-3 rounded-xl relative"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-blue-600 text-xs">
                            {rep.autor?.nombre || "Anónimo"}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">
                            {new Date(rep.creadoEn).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{rep.contenido}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDesc;
