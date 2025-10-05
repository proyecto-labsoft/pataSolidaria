# Guía de Implementación de Geocodificación Inversa

## Resumen de Cambios Implementados

### 1. Entidad Extravio
Se agregaron los siguientes campos:
- `latitud` (Double, obligatorio): Coordenada Y de la ubicación del extravío
- `longitud` (Double, obligatorio): Coordenada X de la ubicación del extravío  
- `direccion` (String, opcional): Dirección textual obtenida por geocodificación inversa

### 2. DTOs Actualizados
- **ExtravioRequestDTO**: Incluye los nuevos campos con validación `@NotNull` para coordenadas
- **ExtravioDetailDTO**: Incluye los nuevos campos para respuestas

### 3. Base de Datos
- Script de migración: `03-add-geolocation.sql`
- Índice creado para futuras búsquedas por proximidad
- Campos con comentarios descriptivos

## Implementación de Geocodificación Inversa (Opcional)

### Opción 1: Google Maps Geocoding API (Recomendado)
```java
@Service
public class GeocodingService {
    
    @Value("${google.maps.api.key}")
    private String apiKey;
    
    public String obtenerDirecci.on(Double latitud, Double longitud) {
        String url = String.format(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&key=%s",
            latitud, longitud, apiKey
        );
        
        // Realizar llamada HTTP y parsear respuesta JSON
        // Retornar la dirección formateada
    }
}
```

### Opción 2: OpenStreetMap Nominatim (Gratuito)
```java
public String obtenerDireccionNominatim(Double latitud, Double longitud) {
    String url = String.format(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f",
        latitud, longitud
    );
    
    // Realizar llamada HTTP y parsear respuesta JSON
    // Retornar la dirección formateada
}
```

### Integración en el Servicio
```java
@Autowired
private GeocodingService geocodingService;

@Transactional
public void saveExtravio(ExtravioRequestDTO extravioDto) {
    Extravio extravioEntity = extravioMapper.toEntity(extravioDto);
    
    // Obtener dirección de forma asíncrona (opcional)
    if (extravioDto.getDireccion() == null) {
        CompletableFuture.runAsync(() -> {
            String direccion = geocodingService.obtenerDireccion(
                extravioDto.getLatitud(), 
                extravioDto.getLongitud()
            );
            extravioEntity.setDireccion(direccion);
            extravioRepository.save(extravioEntity);
        });
    }
    
    extravioRepository.save(extravioEntity);
}
```

## Ejemplo de Request JSON

```json
{
    "creador": 1,
    "mascotaId": 123,
    "zona": "Zona Norte",
    "hora": "2025-10-04T14:30:00",
    "observacion": "Se perdió cerca del parque",
    "atencionMedica": false,
    "latitud": -34.6037,
    "longitud": -58.3816,
    "direccion": "Av. Corrientes 1234, Buenos Aires" // Opcional
}
```

## Ejemplo de Response JSON

```json
{
    "mascotaId": 123,
    "nombreMascota": "Rex",
    "zona": "Zona Norte", 
    "hora": "2025-10-04T14:30:00",
    "observacion": "Se perdió cerca del parque",
    "atencionMedica": false,
    "resuelto": false,
    "latitud": -34.6037,
    "longitud": -58.3816,
    "direccion": "Av. Corrientes 1234, Buenos Aires"
}
```

## Próximos Pasos Sugeridos

### Para Búsquedas por Proximidad
```sql
-- Ejemplo de consulta para encontrar extravíos en un radio de 5km
SELECT *, 
    (6371 * acos(cos(radians(-34.6037)) * cos(radians(latitud)) * 
    cos(radians(longitud) - radians(-58.3816)) + 
    sin(radians(-34.6037)) * sin(radians(latitud)))) AS distancia
FROM extravio 
WHERE (6371 * acos(cos(radians(-34.6037)) * cos(radians(latitud)) * 
    cos(radians(longitud) - radians(-58.3816)) + 
    sin(radians(-34.6037)) * sin(radians(latitud)))) < 5
ORDER BY distancia;
```

### Para Frontend (React Native)
```javascript
// Obtener ubicación actual
const obtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        // Mostrar selector de mapa manual
        return;
    }
    
    const location = await Location.getCurrentPositionAsync({});
    return {
        latitud: location.coords.latitude,
        longitud: location.coords.longitude
    };
};
```

## Notas Importantes

1. **Validación**: Las coordenadas son obligatorias en el frontend
2. **Fallback**: Si no se puede obtener GPS, mostrar mapa para selección manual
3. **Geocodificación**: Se puede implementar más adelante de forma asíncrona
4. **Índices**: Ya está creado el índice para búsquedas eficientes
5. **Extensibilidad**: La misma estructura se puede usar para Avistamientos cuando se implemente