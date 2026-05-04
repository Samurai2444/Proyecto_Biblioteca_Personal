import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/libros")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setLibros(d.libros ?? []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main className="biblioteca-app">
      <h1>Biblioteca</h1>
      <p className="hint">
        Con Docker: <code>http://localhost</code> · Solo Vite: backend en{" "}
        <code>:8000</code> (proxy <code>/api</code>).
      </p>
      {error && <p className="error">No se pudo cargar el catálogo: {error}</p>}
      {!error && libros.length === 0 && <p>Cargando…</p>}
      <ul className="lista-libros">
        {libros.map((l) => (
          <li key={l.id}>
            <strong>{l.titulo}</strong> — {l.autor}
            {l.categoria && (
              <span className="meta"> · {l.categoria.nombre}</span>
            )}
            {l.valoracionMedia != null && (
              <span className="meta"> · ★ {l.valoracionMedia}</span>
            )}
            {l.etiquetas?.length > 0 && (
              <span className="meta">
                {" "}
                · {l.etiquetas.map((t) => t.nombre).join(", ")}
              </span>
            )}
            <span className="meta">
              {" "}
              · ejemplares {l.ejemplaresDisponibles}/{l.ejemplaresTotal}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
