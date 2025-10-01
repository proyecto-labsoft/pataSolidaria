-- Crear secuencias
CREATE SEQUENCE IF NOT EXISTS usuario_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS companiero_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS adopcion_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS extravio_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS postulacion_id_seq START WITH 1 INCREMENT BY 1;

-- Crear tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT DEFAULT nextval('usuario_id_seq') PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    celular INTEGER,
    email VARCHAR(255),
    direccion VARCHAR(255),
    administrador BOOLEAN
);

-- Crear tabla companiero (mascota)
CREATE TABLE IF NOT EXISTS companiero (
    id BIGINT DEFAULT nextval('companiero_id_seq') PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    especie VARCHAR(255) NOT NULL,
    raza VARCHAR(255) NOT NULL,
    sexo CHAR(1) NOT NULL,
    color VARCHAR(255),
    descripicon VARCHAR(255),
    f_naciemiento DATE,
    esterilizado BOOLEAN,
    chipeado BOOLEAN,
    tamanio VARCHAR(255) NOT NULL,
    familiar BIGINT NOT NULL REFERENCES usuario(id)
);

-- Crear tabla adopcion
CREATE TABLE IF NOT EXISTS adopcion (
    id BIGINT DEFAULT nextval('adopcion_id_seq') PRIMARY KEY,
    administrador BIGINT REFERENCES usuario(id),
    mascota BIGINT REFERENCES companiero(id),
    requisitos VARCHAR(255) NOT NULL,
    transito BOOLEAN NOT NULL
);

-- Crear tabla extravio
CREATE TABLE IF NOT EXISTS extravio (
    id BIGINT DEFAULT nextval('extravio_id_seq') PRIMARY KEY,
    creador BIGINT,
    mascota BIGINT,
    zona VARCHAR(255),
    hora TIMESTAMP,
    tiempo_gracia TIMESTAMP,
    atencion_medica BOOLEAN,
    observacion VARCHAR(255)
);

-- Crear tabla postulacion
CREATE TABLE IF NOT EXISTS postulacion (
    id BIGINT DEFAULT nextval('postulacion_id_seq') PRIMARY KEY,
    usuario BIGINT REFERENCES usuario(id),
    adopcion BIGINT REFERENCES adopcion(id),
    fecha DATE NOT NULL
);
