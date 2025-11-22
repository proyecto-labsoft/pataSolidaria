-- Migración para agregar campos de geolocalización a la tabla extravio
-- Fecha: 2025-10-04

-- Primero verificar si el campo resuelto ya existe, si no, agregarlo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'extravio' AND column_name = 'resuelto') THEN
        ALTER TABLE extravio ADD COLUMN resuelto BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Agregar campos de geolocalización, columna creado_By_Familiar y modificar columna familiar
DO $$
BEGIN
    -- Agregar campo latitud (obligatorio)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'extravio' AND column_name = 'latitud') THEN
        ALTER TABLE extravio ADD COLUMN latitud DOUBLE PRECISION;
    END IF;
    
    -- Agregar campo longitud (obligatorio)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'extravio' AND column_name = 'longitud') THEN
        ALTER TABLE extravio ADD COLUMN longitud DOUBLE PRECISION;
    END IF;

    -- Agregar campo latitud (obligatorio)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'avistamiento' AND column_name = 'latitud') THEN
    ALTER TABLE avistamiento ADD COLUMN latitud DOUBLE PRECISION;
    END IF;

    -- Agregar campo longitud (obligatorio)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'avistamiento' AND column_name = 'longitud') THEN
    ALTER TABLE avistamiento ADD COLUMN longitud DOUBLE PRECISION;
    END IF;
    
    -- Agregar campo direccion (opcional)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'extravio' AND column_name = 'direccion') THEN
        ALTER TABLE extravio ADD COLUMN direccion VARCHAR(500);
    END IF;

    ALTER TABLE companiero ALTER COLUMN familiar DROP NOT NULL;


    ALTER TABLE extravio add column creado_By_Familiar bool NOT null default true;
END $$;

-- Comentarios sobre los campos agregados
COMMENT ON COLUMN extravio.latitud IS 'Coordenada de latitud del lugar donde ocurrió el extravío';
COMMENT ON COLUMN extravio.longitud IS 'Coordenada de longitud del lugar donde ocurrió el extravío';
COMMENT ON COLUMN extravio.direccion IS 'Dirección textual obtenida por geocodificación inversa (opcional)';

-- Crear índice para futuras búsquedas por proximidad
CREATE INDEX IF NOT EXISTS idx_extravio_location ON extravio (latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_avistamiento_location ON avistamiento (latitud, longitud);