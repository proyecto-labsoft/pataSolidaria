-- Modificar la tabla companiero (mascota) para permitir NULL en varios campos

-- Permitir NULL en el campo nombre
ALTER TABLE companiero ALTER COLUMN nombre DROP NOT NULL;

-- Permitir NULL en el campo especie
ALTER TABLE companiero ALTER COLUMN especie DROP NOT NULL;

-- Permitir NULL en el campo raza
ALTER TABLE companiero ALTER COLUMN raza DROP NOT NULL;

-- Permitir NULL en el campo sexo
ALTER TABLE companiero ALTER COLUMN sexo DROP NOT NULL;

-- Permitir NULL en el campo tamanio
ALTER TABLE companiero ALTER COLUMN tamanio DROP NOT NULL;

-- Permitir NULL en el campo familiar (foreign key)
ALTER TABLE companiero ALTER COLUMN familiar DROP NOT NULL;
