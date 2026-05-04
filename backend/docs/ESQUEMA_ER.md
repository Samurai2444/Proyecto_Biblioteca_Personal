# Esquema entidad–relación (base de datos)

Modelo lógico de la aplicación de biblioteca social: catálogo, aportaciones de usuarios, interacción (valoraciones, reseñas, comentarios, lectura) y préstamos físicos.

## Diagrama E/R (Mermaid)

```mermaid
erDiagram
    categorias ||--o{ libros : clasifica
    usuarios ||--o{ libros : publica
    usuarios ||--o{ marcadores_lectura : tiene
    usuarios ||--o{ valoraciones : emite
    usuarios ||--o{ resenas : escribe
    usuarios ||--o{ comentarios_libro : escribe
    usuarios ||--o{ favoritos : guarda
    usuarios ||--o{ prestamos : solicita
    usuarios ||--o{ reportes_contenido : abre

    libros ||--o{ ejemplares : contiene
    libros ||--o{ marcadores_lectura : recibe
    libros ||--o{ valoraciones : recibe
    libros ||--o{ resenas : recibe
    libros ||--o{ comentarios_libro : recibe
    libros ||--o{ favoritos : aparece_en
    libros }o--o{ etiquetas : libro_etiqueta

    ejemplares ||--o{ prestamos : objeto_de

    comentarios_libro ||--o{ comentarios_libro : respuesta_a

    usuarios {
        int id PK
        string nombre
        string email UK
        string password
        enum rol
        bool activo
        datetime creado_en
    }

    libros {
        int id PK
        int categoria_id FK
        int propietario_id FK
        string titulo
        string isbn UK
        text descripcion
        string autor
        int anio_publicacion
        string portada_url
        bool compartido_publico
        enum estado_publicacion
        datetime creado_en
    }

    marcadores_lectura {
        int id PK
        int usuario_id FK
        int libro_id FK
        enum estado
        text nota_privada
        datetime actualizado_en
    }

    valoraciones {
        int id PK
        int usuario_id FK
        int libro_id FK
        tinyint puntuacion
        datetime creado_en
    }

    resenas {
        int id PK
        int usuario_id FK
        int libro_id FK
        string titulo
        text cuerpo
        datetime creado_en
    }

    comentarios_libro {
        int id PK
        int libro_id FK
        int usuario_id FK
        int padre_id FK
        text contenido
        datetime creado_en
    }

    reportes_contenido {
        int id PK
        int reportante_id FK
        enum tipo
        int referencia_id
        string motivo
        enum estado
        datetime creado_en
    }
```

## Roles (`usuarios.rol`)

| Valor            | Uso principal                                              |
|------------------|------------------------------------------------------------|
| `usuario`        | Valorar, reseñar, comentar, marcar lectura, favoritos, publicar obras propias |
| `moderador`      | Revisar contenido reportado y colas de publicación        |
| `bibliotecario`  | Gestión de ejemplares y préstamos                         |
| `admin`          | Configuración global y usuarios                           |

## Estados de publicación (`libros.estado_publicacion`)

- `borrador` — solo visible para el autor (la API pública los excluye).
- `pendiente_revision` — enviado a moderación.
- `publicado` — visible según reglas de catálogo.
- `rechazado` — no listado en catálogo público.

Los listados públicos de la API solo incluyen `publicado` y, si hay propietario, `compartido_publico = 1`.

## Lectura (`marcadores_lectura.estado`)

`pendiente` · `en_curso` · `leido`, más `nota_privada` opcional por usuario y libro.

## Fuente SQL

El script canónico que crea y puebla las tablas está en `docker/mysql/bd.sql` (arranque del contenedor MySQL).
