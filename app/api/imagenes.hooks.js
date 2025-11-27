import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateAndRefetch } from './useInvalidateAndRefetch';
import { api } from './api';

/**
 * Hook para subir una imagen
 * @param {string} entityType - Tipo de entidad (mascotas, extravios, avistamientos, adopciones)
 */
export const useSubirImagen = (entityType) => {
  const invalidateAndRefetch = useInvalidateAndRefetch();

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
        `/imagenes/${entityType}/${entityId}`,
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
  return useQuery({
    queryKey: [`imagenes-${entityType}`, entityId],
    queryFn: async () => {
      const response = await api.get(`/imagenes/${entityType}/${entityId}`);
      return response.data;
    },
    enabled: !!entityId, // Solo ejecutar si hay entityId
  });
};

/**
 * Hook para eliminar una imagen
 */
export const useEliminarImagen = (entityType) => {
  const invalidateAndRefetch = useInvalidateAndRefetch();

  return useMutation({
    mutationFn: async (imagenId) => {
      const response = await api.delete(`/imagenes/${imagenId}`);
      return response.data;
    },
    onSuccess: (data, imagenId, context) => {
      // Invalidar todas las queries de imágenes de este tipo
      invalidateAndRefetch([`imagenes-${entityType}`]);
    },
  });
};
