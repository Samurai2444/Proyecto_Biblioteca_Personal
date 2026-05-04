# Frontend — React + Vite

Interfaz de la biblioteca social. Consume la API Symfony a través del prefijo `/api/`.

## Desarrollo

```bash
npm install
npm run dev
```

- Con **solo Vite** en el puerto 5173, las peticiones a `/api/*` se reenvían a `http://127.0.0.1:8000` sin el prefijo `/api` (ver `vite.config.js`). El backend Symfony debe estar en marcha (por ejemplo en el puerto 8000 del compose).

- Con **Docker** (Nginx en el puerto 80), abre http://localhost: el mismo código usa rutas `/api/...` y el proxy Nginx las enruta al backend.

## Build producción

```bash
npm run build
npm run preview
```

## Estructura relevante

- `src/App.jsx` — Listado del catálogo (`GET /api/libros`).
- `vite.config.js` — `server.proxy` para desarrollo local sin Nginx.

Despliegue completo: ver `docker/README.md` en la raíz del monorepo.
