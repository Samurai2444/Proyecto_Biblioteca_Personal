SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reportes_contenido;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS comentarios_libro;
DROP TABLE IF EXISTS resenas;
DROP TABLE IF EXISTS valoraciones;
DROP TABLE IF EXISTS marcadores_lectura;
DROP TABLE IF EXISTS libro_etiqueta;
DROP TABLE IF EXISTS prestamos;
DROP TABLE IF EXISTS ejemplares;
DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS etiquetas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'moderador', 'bibliotecario', 'admin') NOT NULL DEFAULT 'usuario',
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NULL,
    propietario_id INT NULL,
    titulo VARCHAR(500) NOT NULL,
    isbn VARCHAR(32) NULL UNIQUE,
    descripcion TEXT NULL,
    autor VARCHAR(255) NOT NULL,
    anio_publicacion INT NOT NULL,
    portada_url VARCHAR(512) NULL,
    compartido_publico TINYINT(1) NOT NULL DEFAULT 1,
    estado_publicacion ENUM('borrador', 'pendiente_revision', 'publicado', 'rechazado') NOT NULL DEFAULT 'publicado',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_libros_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL,
    CONSTRAINT fk_libros_propietario FOREIGN KEY (propietario_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE libro_etiqueta (
    libro_id INT NOT NULL,
    etiqueta_id INT NOT NULL,
    PRIMARY KEY (libro_id, etiqueta_id),
    CONSTRAINT fk_le_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE,
    CONSTRAINT fk_le_etiqueta FOREIGN KEY (etiqueta_id) REFERENCES etiquetas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ejemplares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    estado ENUM('disponible', 'prestado', 'baja') NOT NULL DEFAULT 'disponible',
    CONSTRAINT fk_ejemplares_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ejemplar_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion_prevista DATE NOT NULL,
    fecha_devolucion DATETIME NULL,
    estado ENUM('activo', 'devuelto', 'retrasado') NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_prestamos_ejemplar FOREIGN KEY (ejemplar_id) REFERENCES ejemplares (id) ON DELETE RESTRICT,
    CONSTRAINT fk_prestamos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE marcadores_lectura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    estado ENUM('pendiente', 'en_curso', 'leido') NOT NULL DEFAULT 'pendiente',
    nota_privada TEXT NULL,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_marcador_usuario_libro (usuario_id, libro_id),
    CONSTRAINT fk_marcadores_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_marcadores_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE valoraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    puntuacion TINYINT UNSIGNED NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_valoracion_usuario_libro (usuario_id, libro_id),
    CONSTRAINT fk_valoraciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_valoraciones_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    titulo VARCHAR(200) NULL,
    cuerpo TEXT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_resena_usuario_libro (usuario_id, libro_id),
    CONSTRAINT fk_resenas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_resenas_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comentarios_libro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT NOT NULL,
    usuario_id INT NOT NULL,
    padre_id INT NULL,
    contenido TEXT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentarios_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE,
    CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_comentarios_padre FOREIGN KEY (padre_id) REFERENCES comentarios_libro (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_favorito_usuario_libro (usuario_id, libro_id),
    CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_favoritos_libro FOREIGN KEY (libro_id) REFERENCES libros (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reportes_contenido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reportante_id INT NOT NULL,
    tipo ENUM('libro', 'comentario', 'resena') NOT NULL,
    referencia_id INT NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    estado ENUM('abierto', 'en_revision', 'cerrado') NOT NULL DEFAULT 'abierto',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reportes_reportante FOREIGN KEY (reportante_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categorias (nombre) VALUES
('Ficción'),
('Ensayo'),
('Infantil'),
('Autoeditado');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Ana López', 'ana@biblioteca.local', '1234', 'usuario'),
('Carlos Gómez', 'carlos@biblioteca.local', '1234', 'bibliotecario'),
('Marta Admin', 'admin@biblioteca.local', '1234', 'admin'),
('Luis Moderador', 'mod@biblioteca.local', '1234', 'moderador');

INSERT INTO etiquetas (nombre) VALUES
('Fantasía'),
('Ciencia'),
('Clásico'),
('Recomendado');
INSERT INTO libros (categoria_id, propietario_id, titulo, isbn, descripcion, autor, anio_publicacion, portada_url, compartido_publico, estado_publicacion) VALUES
(1, NULL, 'El nombre del viento', '978-8401352835', 'Fantasía épica.', 'Patrick Rothfuss', 2007, 'https://m.media-amazon.com/images/I/91pB68V8pHL._AC_UF1000,1000_QL80_.jpg', 1, 'publicado'),
(2, NULL, 'Breve historia del tiempo', '978-8484321465', 'Cosmología accesible.', 'Stephen Hawking', 1988, 'https://m.media-amazon.com/images/I/81I-u8t8S7L._AC_UF1000,1000_QL80_.jpg', 1, 'publicado'),
(3, NULL, 'El principito', '978-8498381499', 'Un viaje filosófico por el universo.', 'Antoine de Saint-Exupéry', 1943, 'https://m.media-amazon.com/images/I/719m3F-RdqL._AC_UF1000,1000_QL80_.jpg', 1, 'publicado'),
(4, 1, 'Relatos del taller', NULL, 'Recopilación propia compartida en la comunidad.', 'Ana López', 2025, 'https://picsum.photos/id/119/400/600', 1, 'publicado'),
(4, 1, 'Borrador personal', NULL, 'Aún no visible hasta revisión.', 'Ana López', 2025, 'https://picsum.photos/id/24/400/600', 0, 'borrador');
INSERT INTO libro_etiqueta (libro_id, etiqueta_id) VALUES
(1, 1), (1, 4), (2, 2), (3, 3), (4, 4);

INSERT INTO ejemplares (libro_id, codigo, estado) VALUES
(1, 'EJ-LIB-001-A', 'disponible'),
(1, 'EJ-LIB-001-B', 'prestado'),
(2, 'EJ-LIB-002-A', 'disponible'),
(3, 'EJ-LIB-003-A', 'disponible');

INSERT INTO prestamos (ejemplar_id, usuario_id, fecha_prestamo, fecha_devolucion_prevista, estado) VALUES
(2, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'activo');

INSERT INTO marcadores_lectura (usuario_id, libro_id, estado, nota_privada) VALUES
(1, 1, 'en_curso', 'Capítulos 1–5: ritmo excelente.'),
(1, 3, 'leido', NULL);

INSERT INTO valoraciones (usuario_id, libro_id, puntuacion) VALUES
(1, 1, 5),
(2, 1, 4),
(1, 2, 5);

INSERT INTO resenas (usuario_id, libro_id, titulo, cuerpo) VALUES
(1, 1, 'Imprescindible', 'Una de las mejores fantasías modernas; personaje muy logrado.'),
(2, 2, 'Denso pero genial', 'Requiere atención; merece varias lecturas.');

INSERT INTO comentarios_libro (libro_id, usuario_id, padre_id, contenido) VALUES
(1, 2, NULL, '¿Alguien sabe si la tercera parte ya tiene fecha?'),
(1, 1, 1, 'De momento sin anuncio oficial.');

INSERT INTO favoritos (usuario_id, libro_id) VALUES
(1, 1), (1, 3), (2, 2);
