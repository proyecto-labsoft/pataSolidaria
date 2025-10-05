# API Mascotas

API REST para el sistema de gestión de mascotas, adopciones y extravíos.

## Requisitos

- Docker
- Docker Compose

## Configuración del Entorno

### Para Desarrolladores

1. Clonar el repositorio:
```bash
git clone https://github.com/proyecto-labsoft/pataSolidaria.git
cd pataSolidaria/api
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
  - `03-add-geolocation.sql`: Agrego a la estructura de la BD los datos para geolocalización
- `GEOLOCATION_GUIDE.md`: Guía completa de implementación de geolocalización

## Base de Datos

La base de datos PostgreSQL se inicializa automáticamente con:
- Tablas: usuarios, mascotas (companieros), adopciones, extravíos y postulaciones
- **Geolocalización**: Los extravíos incluyen campos de latitud, longitud y dirección
- Datos de ejemplo para pruebas (con coordenadas de Ushuaia)
- Índices optimizados para búsquedas geográficas

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
  - GET `/`: Listar extravíos (filtrable por resueltos)
  - POST `/`: Registrar nuevo extravío con geolocalización

- Postulaciones: `/postulaciones`
  - GET `/{id}`: Obtener postulación por ID
  - POST `/`: Crear nueva postulación

## 📍 Funcionalidad de Geolocalización

Los extravíos ahora incluyen datos de ubicación:

### Campos de Geolocalización
- **`latitud`** (obligatorio): Coordenada Y del lugar del extravío
- **`longitud`** (obligatorio): Coordenada X del lugar del extravío  
- **`direccion`** (opcional): Dirección textual para geocodificación
- **`zona`** (existente): Descripción textual de la zona

### Ejemplo de Request
```json
POST /extravios
{
    "creador": 1,
    "mascotaId": 123,
    "zona": "Zona Norte",
    "hora": "2025-10-04T14:30:00",
    "observacion": "Se perdió cerca del parque",
    "atencionMedica": false,
    "latitud": -54.8019,
    "longitud": -68.3030,
    "direccion": "Parque Central, Ushuaia"
}
```

### Ejemplo de Response
```json
{
    "mascotaId": 123,
    "nombreMascota": "Max",
    "zona": "Zona Norte",
    "hora": "2025-10-04T14:30:00",
    "observacion": "Se perdió cerca del parque",
    "atencionMedica": false,
    "resuelto": false,
    "latitud": -54.8019,
    "longitud": -68.3030,
    "direccion": "Parque Central, Ushuaia"
}
```

Ver `GEOLOCATION_GUIDE.md` para más detalles sobre implementación y funcionalidades avanzadas.

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
