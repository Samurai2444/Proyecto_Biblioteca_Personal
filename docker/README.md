# Despliegue con Docker

Definición de servicios en `compose.yaml` de esta carpeta. Desde la **raíz del repositorio**:

```bash
docker compose up -d --build
```

Si tu versión de Docker Compose no soporta `include`, usa:

```bash
docker compose -f docker/compose.yaml up -d --build
```

## Servicios y puertos

| Servicio           | Puerto host | Descripción                          |
|--------------------|------------|--------------------------------------|
| `srs_proxyinverso` | 80, 443    | Nginx: React + API bajo `/api/`      |
| `frontend`         | (interno)  | Vite en 5173                         |
| `backend`          | 8000       | Symfony (PHP built-in server)        |
| `mysql`            | 3306       | MySQL 8                              |
| `gestor_srs`       | 8080       | phpMyAdmin                           |

- **Web:** http://localhost  
- **API directa:** http://127.0.0.1:8000/… (sin prefijo `/api`)  
- **API vía Nginx:** http://localhost/api/… (Nginx quita el prefijo `/api` al reenviar a Symfony)

## Variables de entorno (MySQL y phpMyAdmin)

1. Copia los ejemplos a la **raíz del repo** (donde espera el compose):

   - `docker/env.mysql.example` → `../.bdSRS`
   - `docker/env.pma.example` → `../.adminSRS`

2. Ajusta contraseñas. El `DATABASE_URL` del servicio `backend` debe usar el mismo usuario, contraseña y base que `MYSQL_USER`, `MYSQL_PASSWORD` y `MYSQL_DATABASE` en `.bdSRS`.

Los archivos `.bdSRS` y `.adminSRS` están en `.gitignore`.

## Acceso a la base de datos

### phpMyAdmin

- URL: http://localhost:8080  
- Usuario: el definido en `.bdSRS` como `MYSQL_USER` (por defecto en el ejemplo: `biblioteca`).  
- Contraseña: `MYSQL_PASSWORD` del mismo archivo.

### Cliente externo (DBeaver, HeidiSQL, CLI…)

- **Host:** `127.0.0.1` (o `localhost`)  
- **Puerto:** `3306`  
- **Base de datos:** valor de `MYSQL_DATABASE` (ej. `biblioteca_srs`)  
- **Usuario / contraseña:** los de `.bdSRS`

### Desde el contenedor MySQL

```bash
docker compose exec mysql mysql -u biblioteca -p biblioteca_srs
```

## Inicialización SQL

El fichero `mysql/bd.sql` se monta en `/docker-entrypoint-initdb.d/` y solo se ejecuta cuando el **volumen de datos de MySQL está vacío**. Para forzar una recreación limpia:

```bash
docker compose down -v
docker compose up -d --build
```

## Estructura de esta carpeta

```
docker/
  compose.yaml      # Servicios
  nginx/            # Imagen Nginx + TLS autofirmado
  mysql/bd.sql      # Esquema y datos semilla
  env.mysql.example
  env.pma.example
  README.md
```
