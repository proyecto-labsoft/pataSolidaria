-- Script para agregar campos de autenticación Firebase y notificaciones push
-- Ejecutar después de los scripts existentes

-- Agregar columna para Firebase UID
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;

-- Agregar columna para Push Token
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Agregar columna para habilitar/deshabilitar notificaciones
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS notificaciones_habilitadas BOOLEAN DEFAULT true;

-- Crear índice para mejorar búsquedas por firebase_uid
CREATE INDEX IF NOT EXISTS idx_usuario_firebase_uid ON usuario(firebase_uid);

-- Comentarios para documentar las columnas
COMMENT ON COLUMN usuario.firebase_uid IS 'UID del usuario en Firebase Authentication';
COMMENT ON COLUMN usuario.push_token IS 'Token para enviar notificaciones push al dispositivo';
COMMENT ON COLUMN usuario.notificaciones_habilitadas IS 'Indica si el usuario tiene las notificaciones habilitadas';
