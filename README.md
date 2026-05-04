# Proyecto Biblioteca

Monorepo: **React (Vite)** + **Symfony** + **MySQL**, con despliegue por Docker.

## ¿Necesito Node, Vite o React en mi PC?

**No**, si usas solo Docker. La imagen del servicio `frontend` ejecuta `npm install` al construirse; Vite y React van **dentro del contenedor**. En tu máquina solo hace falta **Docker Desktop** (o Docker Engine + Compose).

Instala Node.js **solo** si quieres ejecutar `npm run dev` fuera de Docker (desarrollo del front en el host).

## Inicio rápido

```bash
# En la raíz: copiar variables (ver docker/env.*.example → .bdSRS y .adminSRS)
docker compose up -d --build
```

- Aplicación: http://localhost  
- phpMyAdmin: http://localhost:8080  
- API Symfony directa: http://127.0.0.1:8000  

Documentación del despliegue: **[docker/README.md](docker/README.md)**  
Backend: **[backend/README.md](backend/README.md)**  
Frontend: **[frontend/README.md](frontend/README.md)**  
Esquema E/R: **[backend/docs/ESQUEMA_ER.md](backend/docs/ESQUEMA_ER.md)**
