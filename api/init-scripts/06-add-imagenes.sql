-- Tabla principal de imágenes
CREATE TABLE IF NOT EXISTS imagen (
    id BIGSERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_storage VARCHAR(500) NOT NULL,      -- Ruta en Firebase Storage: "mascotas/123/foto1.jpg"
    url_publica VARCHAR(1000),               -- URL de descarga de Firebase
    tipo_mime VARCHAR(100),                  -- image/jpeg, image/png, etc.
    tamanio BIGINT,                          -- Tamaño en bytes
    fecha_subida TIMESTAMP DEFAULT NOW()
);

-- Tabla intermedia: Mascotas e Imágenes
CREATE TABLE IF NOT EXISTS mascota_imagen (
    mascota_id BIGINT NOT NULL,
    imagen_id BIGINT NOT NULL,
    orden INT DEFAULT 0,
    PRIMARY KEY (mascota_id, imagen_id),
    CONSTRAINT fk_mascota FOREIGN KEY (mascota_id) 
        REFERENCES companiero(id) ON DELETE CASCADE,
    CONSTRAINT fk_mascota_imagen FOREIGN KEY (imagen_id) 
        REFERENCES imagen(id) ON DELETE CASCADE
);

-- Tabla intermedia: Extravíos e Imágenes
CREATE TABLE IF NOT EXISTS extravio_imagen (
    extravio_id BIGINT NOT NULL,
    imagen_id BIGINT NOT NULL,
    orden INT DEFAULT 0,
    PRIMARY KEY (extravio_id, imagen_id),
    CONSTRAINT fk_extravio FOREIGN KEY (extravio_id) 
        REFERENCES extravio(id) ON DELETE CASCADE,
    CONSTRAINT fk_extravio_imagen FOREIGN KEY (imagen_id) 
        REFERENCIAS imagen(id) ON DELETE CASCADE
);

-- Tabla intermedia: Avistamientos e Imágenes
CREATE TABLE IF NOT EXISTS avistamiento_imagen (
    avistamiento_id BIGINT NOT NULL,
    imagen_id BIGINT NOT NULL,
    orden INT DEFAULT 0,
    PRIMARY KEY (avistamiento_id, imagen_id),
    CONSTRAINT fk_avistamiento FOREIGN KEY (avistamiento_id) 
        REFERENCES avistamiento(id) ON DELETE CASCADE,
    CONSTRAINT fk_avistamiento_imagen FOREIGN KEY (imagen_id) 
        REFERENCES imagen(id) ON DELETE CASCADE
);

-- Tabla intermedia: Adopciones e Imágenes
CREATE TABLE IF NOT EXISTS adopcion_imagen (
    adopcion_id BIGINT NOT NULL,
    imagen_id BIGINT NOT NULL,
    orden INT DEFAULT 0,
    PRIMARY KEY (adopcion_id, imagen_id),
    CONSTRAINT fk_adopcion FOREIGN KEY (adopcion_id) 
        REFERENCES adopcion(id) ON DELETE CASCADE,
    CONSTRAINT fk_adopcion_imagen FOREIGN KEY (imagen_id) 
        REFERENCES imagen(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_mascota_imagen_mascota ON mascota_imagen(mascota_id);
CREATE INDEX IF NOT EXISTS idx_extravio_imagen_extravio ON extravio_imagen(extravio_id);
CREATE INDEX IF NOT EXISTS idx_avistamiento_imagen_avistamiento ON avistamiento_imagen(avistamiento_id);
CREATE INDEX IF NOT EXISTS idx_adopcion_imagen_adopcion ON adopcion_imagen(adopcion_id);
CREATE INDEX IF NOT EXISTS idx_imagen_fecha ON imagen(fecha_subida);

-- Comentarios para documentación
COMMENT ON TABLE imagen IS 'Almacena metadatos de imágenes subidas a Firebase Storage';
COMMENT ON COLUMN imagen.ruta_storage IS 'Ruta completa en Firebase Storage';
COMMENT ON COLUMN imagen.url_publica IS 'URL pública de descarga de Firebase';
COMMENT ON TABLE mascota_imagen IS 'RelaciónMany-to-Many entre mascotas e imágenes';
COMMENT ON TABLE extravio_imagen IS 'Relación Many-to-Many entre extravíos e imágenes';
COMMENT ON TABLE avistamiento_imagen IS 'Relación Many-to-Many entre avistamientos e imágenes';
COMMENT ON TABLE adopcion_imagen IS 'Relación Many-to-Many entre adopciones e imágenes';
