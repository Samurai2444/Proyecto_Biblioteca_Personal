# Backend — Symfony (API)

API REST ligera para la biblioteca social: catálogo público, reseñas, comentarios, préstamos y datos de valoraciones.

## Requisitos

- PHP ≥ 8.2, Composer  
- Extensión **pdo_mysql** (e **intl** recomendada)  
- MySQL 8 (o el contenedor definido en `docker/`)

## Configuración

Copia variables en `.env` / `.env.local`. La cadena típica contra MySQL en local (puerto expuesto por Docker) es:

```env
DATABASE_URL="mysql://biblioteca:biblioteca_clave@127.0.0.1:3306/biblioteca_srs?serverVersion=8.0.32&charset=utf8mb4"
```

En contenedor, `DATABASE_URL` la define `docker/compose.yaml`.

## Servidor PHP embebido (sin Docker)

Symfony necesita el **router** para que rutas como `/libros` lleguen a `index.php`:

```bash
cd public
php -S 127.0.0.1:8000 -t . router.php
```

(o desde la raíz del backend: `php -S 127.0.0.1:8000 -t public public/router.php`).

## Comandos útiles

```bash
composer install
php bin/console doctrine:schema:validate
php bin/console debug:router
```

## Rutas API (Symfony; detrás de Nginx van con prefijo `/api/`)

| Método | Ruta Symfony        | Descripción                    |
|--------|---------------------|--------------------------------|
| GET    | `/health/db`        | Comprueba conexión a la BD     |
| GET    | `/categorias`       | Listado de categorías          |
| GET    | `/etiquetas`        | Listado de etiquetas           |
| GET    | `/libros`           | Catálogo público con stats     |
| GET    | `/libros/{id}/resenas`    | Reseñas de un libro      |
| GET    | `/libros/{id}/comentarios` | Comentarios (hilos)     |
| GET    | `/prestamos/activos`      | Préstamos activos       |

Los endpoints de escritura (login, crear reseña, etc.) se pueden añadir con `Security` y validación; el modelo de datos ya está preparado en MySQL.

## Modelo de datos y E/R

Documentación del esquema (tablas, roles, estados) y diagrama Mermaid:

- [`docs/ESQUEMA_ER.md`](docs/ESQUEMA_ER.md)

Entidades en `src/Entity/`; SQL canónico en `docker/mysql/bd.sql`.

## Tests

```bash
php bin/phpunit
```
