# API Mascotas

API REST para el sistema de gestión de mascotas, adopciones y extravíos.

## Requisitos

- Docker
- Docker Compose

## Configuración del Entorno

### Para Desarrolladores

1. Clonar el repositorio:
```bash
git clone https://github.com/JomaGaray/api-mascotas.git
cd api-mascotas
```

2. Compilar el proyecto y generar el JAR:
```bash
mvn clean package (-DskipTests)
```

3. Construir y subir la imagen Docker:
```bash
docker-compose build api
docker-compose push api
```

4. Iniciar los servicios:
```bash
docker-compose up
```

### Para Consumidores de la API

1. Clonar el repositorio o copiar los archivos:
   - `docker-compose.yml`
   - Directorio `init-scripts/`

2. Descargar la última versión de la API y ejecutar los servicios:
```bash
docker-compose pull api
docker-compose up
```

## Estructura del Proyecto

- `src/`: Código fuente de la API
- `init-scripts/`: Scripts SQL para inicialización de la base de datos
  - `01-init.sql`: Estructura de la base de datos
  - `02-data.sql`: Datos de ejemplo

## Base de Datos

La base de datos PostgreSQL se inicializa automáticamente con:
- Tablas: usuarios, mascotas (companieros), adopciones, extravíos y postulaciones
- Datos de ejemplo para pruebas

## Endpoints Disponibles

- Usuarios: `/usuarios`
  - GET `/{id}`: Obtener usuario por ID
  - POST `/`: Crear nuevo usuario

- Mascotas: `/mascotas`
  - GET `/{id}`: Obtener mascota por ID
  - GET `/user/{userId}`: Obtener mascotas por usuario
  - POST `/`: Registrar nueva mascota
  - PUT `/{id}`: Actualizar mascota

- Adopciones: `/adopciones`
  - GET `/`: Listar adopciones
  - POST `/`: Crear nueva adopción

- Extravíos: `/extravios`
  - GET `/user/{id}`: Obtener extravíos por usuario
  - POST `/`: Registrar nuevo extravío

- Postulaciones: `/postulaciones`
  - GET `/{id}`: Obtener postulación por ID
  - POST `/`: Crear nueva postulación

## Actualizaciones

Cuando se realizan cambios en el código:

1. Compilar y generar nuevo JAR:
```bash
mvn clean package
```

2. Construir y subir nueva imagen:
```bash
docker-compose build api
docker-compose push api
```

Los consumidores de la API solo necesitan:
```bash
docker-compose pull api
docker-compose up
```

## Notas

- La API corre en el puerto 8083
- La base de datos PostgreSQL usa el puerto 5432
- Los datos persisten en un volumen Docker (`postgres_data`)
- La imagen de la API se encuentra en Docker Hub: `esaizar88/api-mascotas:latest`
