/**
 * Reemplaza los placeholders `{param}` en una URL base con los valores proporcionados en un objeto de parámetros.
 *
 * @function
 * @param {string} baseUrl - La URL base que puede contener placeholders entre llaves (por ejemplo, `/api/usuarios/{id}`).
 * @param {Object} [parametros={}] - Objeto con las claves y valores que se deben insertar en la URL. Cada clave debe coincidir con un placeholder en `baseUrl`.
 * @returns {string|undefined} - La URL con los placeholders reemplazados, o `undefined` si `baseUrl` no fue proporcionada.
 *
 * @example
 * urlConParametros('/api/usuarios/{id}/posts/{postId}', { id: 12, postId: 34 });
 * // Devuelve: '/api/usuarios/12/posts/34'
 *
 * @example
 * urlConParametros('/api/items/{itemId}', { });
 * // Devuelve: '/api/items/{itemId}' y muestra una advertencia en consola.
 */
const urlConParametros = (baseUrl, parametros = {}) => {
  let url = baseUrl;

  if (!baseUrl) {
    console.error('❌ Error: La URL base es undefined');
    return undefined;
  }

  const parametrosEnUrl = url.match(/{\w+}/g);
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!parametrosEnUrl) {
      // Reemplazar parámetros en la URL
      parametrosEnUrl.forEach((param) => {
        const key = param.replace(/[{}]/g, ''); // Eliminar { y }
        if (key === 'queryParams') { //si es queryParams, no lo reemplazo en la url porque va al final. 
          return;
        }
        if (parametros[key] !== undefined) {
          url = url.replace(param, parametros[key]);
        } else {
          console.warn(`⚠️ Advertencia: Falta el parámetro '${key}' para la URL.`);
        }
      });
  }


  return url;
};

export default urlConParametros;