/**
 * Genera una query key estándar para usar con React Query, 
 * eliminando parámetros `null` o `undefined` y devolviendo una key consistente.
 *
 * @function
 * @param {string} nombreHook - Nombre identificador del hook (por ejemplo: 'useUsuariosGet').
 * @param {Object} [params={}] - Objeto con los parámetros que se le pasan al hook.
 * @returns {Array} Una array que representa la `queryKey`, compuesta por el nombre del hook y, si existen, los parámetros filtrados como objeto.
 *
 * @example
 * generarQueryKey('useUsuariosGet', { id: 5, activo: true });
 * // Devuelve: ['useUsuariosGet', { id: 5, activo: true }]
 *
 * @example
 * generarQueryKey('useTramitesGet');
 * // Devuelve: ['useTramitesGet']
 *
 * @example
 * generarQueryKey('useUsuariosGet', { id: null, activo: undefined });
 * // Devuelve: ['useUsuariosGet']
 */
// eslint-disable-next-line import/prefer-default-export
export const generarQueryKey = (nombreHook, params = {}) => {
  // Filtra parámetros nulos o undefined para que no formen parte de la queryKey
  const parametrosString = Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(params).filter(([_, valor]) => valor !== undefined && valor !== null)
  );

  // Si no hay parámetros, solo usa el nombre del hook
  if (Object.keys(parametrosString).length === 0) {
    return [nombreHook];
  }

  // Devuelve el queryKey en formato [nombreHook, parametros] (no en JSON, sino como objeto)
  return [nombreHook, parametrosString];
};
