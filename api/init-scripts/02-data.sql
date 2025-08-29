-- Insertar usuarios de ejemplo
INSERT INTO usuario (nombre, celular, email, direccion, administrador) VALUES
('Juan Pérez', 1234567890, 'juan@example.com', 'Calle 123', false),
('María García', 987654321, 'maria@example.com', 'Avenida 456', true),
('Carlos López', 555666777, 'carlos@example.com', 'Plaza 789', false);

-- Insertar mascotas de ejemplo
INSERT INTO companiero (nombre, especie, raza, sexo, color, descripicon, f_naciemiento, esterilizado, chipeado, familiar) VALUES
('Max', 'Perro', 'Labrador', 'M', 'Dorado', 'Perro muy amigable y juguetón', '2022-01-15', true, false, 1),
('Luna', 'Gato', 'Siames', 'H', 'Blanco y Negro', 'Gata tranquila y cariñosa', '2021-06-20', true, true, 2),
('Rocky', 'Perro', 'Pastor Alemán', 'M', 'Negro y Marrón', 'Perro guardián y leal', '2023-03-10', false, true, 3);

-- Insertar adopciones de ejemplo
INSERT INTO adopcion (administrador, mascota, requisitos, transito) VALUES
(2, 1, 'Patio grande, experiencia con perros', true),
(2, 2, 'Hogar sin otros gatos, ambiente tranquilo', false);

-- Insertar extravíos de ejemplo
INSERT INTO extravio (creador, mascota, zona, hora, tiempo_gracia, atencion_medica, observacion) VALUES
(1, 3, 'Parque Central', '2025-08-27 15:30:00', '2025-08-28 15:30:00', false, 'Visto por última vez cerca de la fuente'),
(3, 1, 'Plaza Mayor', '2025-08-26 18:45:00', '2025-08-27 18:45:00', true, 'Lleva collar rojo con placa de identificación');

-- Insertar postulaciones de ejemplo
INSERT INTO postulacion (usuario, adopcion, fecha) VALUES
(1, 1, '2025-08-27'),
(3, 2, '2025-08-26');
