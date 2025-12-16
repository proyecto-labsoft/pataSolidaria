import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateAndRefetch } from './useInvalidateAndRefetch';
import { api } from './api';
import { API_URL } from './api.rutas';

// Mapeo de plural a singular para endpoints del backend
const entityTypeMap = {
  'mascotas': 'mascota',
  'extravios': 'extravio',
  'avistamientos': 'avistamiento',
  'adopciones': 'adopcion'
};

/**
 * Hook para subir una imagen
 * @param {string} entityType - Tipo de entidad (mascotas, extravios, avistamientos, adopciones)
 */
export const useSubirImagen = (entityType) => {
  const invalidateAndRefetch = useInvalidateAndRefetch();
  const backendEntityType = entityTypeMap[entityType] || entityType;

  return useMutation({
    mutationFn: async ({ entityId, file, orden = 0 }) => {
      const formData = new FormData();
      
      // En React Native, el archivo viene con uri, name y type
      const fileToUpload = {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `image-${Date.now()}.jpg`,
      };

      formData.append('file', fileToUpload);
      formData.append('orden', orden.toString());

      const response = await api.post(
        `${API_URL}/imagenes/${backendEntityType}/${entityId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar las queries de imágenes de esta entidad
      invalidateAndRefetch([`imagenes-${entityType}`, variables.entityId]);
    },
  });
};


/**
 * Hook para obtener imágenes de una entidad
 * @param {string} entityType - Tipo de entidad (mascotas, extravios, avistamientos, adopciones)
 * @param {number} entityId - ID de la entidad
 */
export const useObtenerImagenes = (entityType, entityId) => {
  const backendEntityType = entityTypeMap[entityType] || entityType;
  
  return useQuery({
    queryKey: [`imagenes-${entityType}`, entityId],
    queryFn: async () => {
      try {
        const response = await api.get(`${API_URL}/imagenes/${backendEntityType}/${entityId}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener imágenes de ${backendEntityType}/${entityId}:`, error);
        console.error('URL intentada:', `${API_URL}/imagenes/${backendEntityType}/${entityId}`);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        throw error;
      }
    },
    enabled: !!entityId, // Solo ejecutar si hay entityId
    retry: 1, // Reducir reintentos para debug
  });
};

/**
 * Hook para eliminar una imagen
 */
export const useEliminarImagen = (entityType) => {
  const invalidateAndRefetch = useInvalidateAndRefetch();

  return useMutation({
    mutationFn: async (imagenId) => {
      const response = await api.delete(`${API_URL}/imagenes/${imagenId}`);
      return response.data;
    },
    onSuccess: (data, imagenId, context) => {
      // Invalidar todas las queries de imágenes de este tipo
      invalidateAndRefetch([`imagenes-${entityType}`]);
    },
  });
};
