import axios from 'axios';
/**
 * Objeto `api` que encapsula los métodos HTTP comunes usando Axios,
 * proporcionando una interfaz uniforme para `get`, `post`, `patch` y `delete`.
 *
 * @namespace api
 * @property {Function} get - Realiza una solicitud HTTP GET.
 * @property {Function} post - Realiza una solicitud HTTP POST.
 * @property {Function} put - Realiza una solicitud HTTP PUT.
 * @property {Function} patch - Realiza una solicitud HTTP PATCH.
 * @property {Function} delete - Realiza una solicitud HTTP DELETE.
 *
 * @example
 * const response = await api.get('/usuarios');
 * const created = await api.post('/usuarios', { nombre: 'Ana' });
 * const updated = await api.patch('/usuarios/1', { activo: false });
 * const updatedFull = await api.put('/usuarios/1', { nombre: 'Ana', activo: false });
 * const removed = await api.delete('/usuarios/1');
 */
// eslint-disable-next-line import/prefer-default-export
export const api = {
  /**
   * Realiza una solicitud HTTP GET a la URL especificada.
   * @param {string} url - URL de la solicitud.
   * @param {Object} [config={}] - Configuración opcional de Axios (headers, params, etc.).
   * @returns {Promise<AxiosResponse>} Respuesta de Axios.
   */
  get: (url, config = {}) => axios.get(url, config),
  /**
   * Realiza una solicitud HTTP POST a la URL especificada con los datos provistos.
   * @param {string} url - URL de la solicitud.
   * @param {Object} [data={}] - Datos a enviar en el cuerpo de la solicitud.
   * @param {Object} [config={}] - Configuración opcional de Axios.
   * @returns {Promise<AxiosResponse>} Respuesta de Axios.
   */
  post: (url, data, config = {}) => axios.post(url, data, config),

  /**
   * Realiza una solicitud HTTP PUT a la URL especificada con los datos provistos.
   * @param {string} url - URL de la solicitud.
   * @param {Object} [data={}] - Datos a enviar en el cuerpo de la solicitud.
   * @param {Object} [config={}] - Configuración opcional de Axios.
   * @returns {Promise<AxiosResponse>} Respuesta de Axios.
   */
  put: (url, data, config = {}) => axios.put(url, data, config),
  /**
   * Realiza una solicitud HTTP PATCH a la URL especificada con los datos provistos.
   * @param {string} url - URL de la solicitud.
   * @param {Object} data - Datos a enviar en el cuerpo de la solicitud.
   * @param {Object} [config={}] - Configuración opcional de Axios.
   * @returns {Promise<AxiosResponse>} Respuesta de Axios.
   */
  patch: (url, data, config = {}) => axios.patch(url, data, config),
  /**
   * Realiza una solicitud HTTP DELETE a la URL especificada.
   * @param {string} url - URL de la solicitud.
   * @param {Object} [config={}] - Configuración opcional de Axios.
   * @returns {Promise<AxiosResponse>} Respuesta de Axios.
   */
  delete: (url, config = {}) => axios.delete(url, config),
};
