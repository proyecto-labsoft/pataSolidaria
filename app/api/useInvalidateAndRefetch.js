import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook personalizado que permite invalidar queries, actualizarlas manualmente con un `updater`,
 * y realizar `refetch` opcionalmente, usando React Query.
 *
 * @function
 * @returns {Function} Función que invalida, actualiza y refetch queries según los parámetros dados.
 *
 * @example
 * const invalidateAndRefetch = useInvalidateAndRefetch();
 * await invalidateAndRefetch('useUsuariosGet', {
 *   params: { id: 1 },
 *   shouldRefetch: true
 * });
 *
 * @example
 * await invalidateAndRefetch(['useA', 'useB'], {
 *   params: [{ id: 1 }, { tipo: 'admin' }],
 *   updater: (oldData) => [...oldData, nuevoElemento],
 *   shouldRefetch: false
 * });
 *
 * @param {string|string[]} queries - Uno o varios nombres de hooks o claves base de las queries.
 * @param {Object} [options] - Opciones adicionales.
 * @param {Object|Object[]} [options.params={}] - Objeto (o array de objetos) con los parámetros usados para generar las query keys.
 * @param {boolean} [options.shouldRefetch=true] - Indica si debe ejecutarse un `refetch` después de invalidar.
 * @param {Function|null} [options.updater=null] - Función opcional para actualizar manualmente el `cache` usando `setQueryData`.
 * @returns {Promise<void>} Una promesa que se resuelve cuando finalizan las invalidaciones y/o refetch.
 */
// eslint-disable-next-line import/prefer-default-export
export function useInvalidateAndRefetch() {
  const queryClient = useQueryClient();

  return async (queries, { shouldRefetch = true, updater = null } = {}) => {
    
    const keys = Array.isArray(queries) ? queries : [queries];//esto ataja si se trata de un string

    // Determina los parámetros para cada queryKey
    const queryKeys = keys.map((key) => {
      const newKey = Array.isArray(key) ? key : [key];
      return newKey;
    });
    // Invalida todas las query keys
    await Promise.all(
      queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
    );

    // Si se define un updater, actualiza los datos manualmente
    if (updater) {
      queryKeys.forEach((queryKey) => {
        queryClient.setQueryData(queryKey, (oldData) => updater(oldData)
        );
      });
    }

    // Si se requiere refetch, lo ejecuta
    if (shouldRefetch) {
      await Promise.all(
        queryKeys.map((queryKey) => queryClient.refetchQueries({ queryKey }))
      );
    }
  };
}