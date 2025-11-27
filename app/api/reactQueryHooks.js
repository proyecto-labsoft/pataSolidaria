
import { api } from './api';
import {
  useQuery,
  useMutation,
  useQueries,
} from '@tanstack/react-query';
import { useInvalidateAndRefetch } from './useInvalidateAndRefetch';
import { generarQueryKey } from './generarQueryKey'; 
import urlConParametros from './urlConParametros';

/**
 * Función fetcher para realizar peticiones GET utilizando Axios.
 *
 * @async
 * @function
 * @param {Object} options - Opciones para la petición.
 * @param {Object} options.params - Parámetros de consulta para la URL. 
 * @param {string} options.url - URL base de la petición.
 * @param {Object} [options.configAxios={}] - Configuración adicional para Axios (headers, responseType, etc).
 * @returns {Promise<any>} Respuesta de la petición (response.data).
 * @throws {Error} Lanza un error si la petición falla.
 */
export const fetcher = async ({ params, url, configAxios = {} }) => {
  //const [nombreHook, params] = queryKey;
 

  // Extraemos configuraciones adicionales
  const {
    headers: customHeaders = {},
    responseType,
    ...otrosConfig
  } = configAxios;

  // Unificamos headers
  const headers = { 
    ...customHeaders,
  };

  // Determinamos la URL final (con parámetros si aplica)
  const finalUrl = Object.keys(params).length > 0 && !!url
    ? urlConParametros(url, params)
    : url;
 
     const queryParams = params && params.queryParams ? params.queryParams : {};

  try {
    const response = await api.get(finalUrl, {
      params: queryParams,
      headers,
      responseType,
      ...otrosConfig,
    }); 
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data ?? "Algo salió mal.");
  }
};


/**
 * Hook personalizado de React Query para realizar peticiones GET con autenticación opcional y configuración personalizada.
 *
 * @function
 * @param {Object} options - Opciones de configuración para el hook.
 * @param {string} options.nombreHook - Nombre del hook, usado para generar la query key.
 * @param {string} options.url - Endpoint para la petición GET.
 * @param {Object} [options.params={}] - Parámetros de consulta para la petición. 
 * @param {Object} [options.configAxios={}] - Configuración adicional para Axios.
 * @param {Object} [options.configuracion={}] - Opciones adicionales para useQuery (enabled, staleTime, meta, etc).
 * @param {boolean} [options.configuracion.enabled=true] - Si la query debe ejecutarse automáticamente.
 * @param {Object} [options.configuracion.meta] - Información meta personalizada para la query.
 * @returns {import('@tanstack/react-query').UseQueryResult} Objeto resultado de useQuery (data, status, error, etc).
 */
export const useGet = ({
  nombreHook,
  url,
  params = {},
  configuracion = {}, // opciones de useQuery (p.e. enabled, staleTime o meta)
}) => {

  const queryKey = generarQueryKey(nombreHook, params); 
  const isEnabled = configuracion?.enabled ?? true;
  // Define para los get un meta por defecto
  // que se puede sobreescribir en configuracion.meta

  const defaultMeta = {
    habilitarExito: false,
    habilitarAdvertencia: false,
    habilitarError: true,
    mensajeError: { tipo: 'flotante', severity: 'error', titulo: "Error al obtener los datos", tiempo: false },
  }

  const { meta , configAxios = {}, ...otrasConfiguraciones} = configuracion

  // Merge con defaultMeta y configuracion.meta para permitir personalización
  const mergedMeta = {
    ...defaultMeta,
    ...(meta || {}),
  };
return (useQuery({
    queryKey, // La queryKey es [nombreHook, {parametros}] para la v5
    queryFn: () => {
      if (url === undefined || url === null) {
        console.error('URL inválida (undefined o null):', url);
      }
     
      return fetcher({
        params,
        token: null,
        url,
        configAxios,
      });
    },
    cacheTime: 1000 * 60 * 60, // 1 hora
    meta: mergedMeta,
    enabled: isEnabled,
    refetchOnWindowFocus: false, // No refrescar al enfocar la ventana
    ...otrasConfiguraciones,
  })
)
};


/**
 * Hook personalizado para realizar múltiples peticiones GET en paralelo usando React Query.
 * Permite ejecutar varias consultas a la misma URL base pero con diferentes parámetros.
 *
 * @function
 * @param {Object} options - Opciones de configuración para el hook.
 * @param {string} options.nombreHook - Nombre del hook, usado para generar la query key.
 * @param {string} options.url - URL base para las peticiones GET.
 * @param {Array<Object>} [options.parametros=[]] - Array de objetos con los parámetros de consulta para cada petición.
 * @param {Object} [options.configuracion={}] - Opciones adicionales para useQueries (enabled, meta, etc).
 * @returns {Object} Objeto con los resultados de las queries.
 * @returns {Array<any>} return.data - Array con los datos de cada petición.
 * @returns {boolean} return.isLoading - Indica si alguna de las queries está cargando.
 * @returns {boolean} return.isError - Indica si alguna de las queries tiene error.
 * @returns {Array<import('@tanstack/react-query').UseQueryResult>} return.queries - Array con los resultados completos de cada query.
 *
 * @example
 * const { data, isLoading, isError, queries } = useGetParallel({
 *   nombreHook: 'usuariosPorId',
 *   url: '/api/usuarios',
 *   parametros: [{ id: 1, queryParams:{p1: "value"} }, { id: 2 }],
 *   configuracion: { enabled: true }
 * });
 */
export function useGetParallel({
  nombreHook,//es el mismo hook
  url, // es la misma url de base
  params = [], //cambian los parametros sobre la misma url
  configuracion = {},
}) {

  const { 
          conAuth = true,
          meta = {}, //customMeta
          configAxios = {}, // opciones de axios extra (p.e. responseType, headers custome)
          contentType = 'application/json',
          ...configuracionAdicional
      } = configuracion

  const obtenerFinalUrl = (param, ruta)=>(Object.keys(param).length > 0 && !!ruta
    ? urlConParametros(ruta, param)
    : url)
    // Genera un array de queries con su params y finalUrl
    const listadoQueries = params?.map((param) => ({
      params: param,
      finalUrl: obtenerFinalUrl(param, url),
    })) || [];
 
       // Extraemos configuraciones adicionales
      const {
        headers: customHeaders = {'Content-Type': contentType},
        responseType,
        ...otrosConfig
      } = configAxios;

      // Unificamos headers
      const headers = { 
        ...customHeaders,
      };
  
   const defaultMeta = {
      habilitarExito: false,
      habilitarAdvertencia: false,
      habilitarError: true,
      mensajeError: { tipo: 'flotante', severity: 'error', titulo: "Error al obtener los datos", tiempo: false },
    }

  // Merge con defaultMeta y configuracion.meta para permitir personalización
  const mergedMeta = {
    ...defaultMeta,
    ...(meta || {}),
  };
  const queries = useQueries({
    queries: listadoQueries.map((query) => ({
      queryKey: [nombreHook, query.params],
      queryFn: async () => {
        const { data } = await api.get(query.finalUrl, {
          params: query.params.queryParams ?? {},
          headers,
          responseType,
          ...otrosConfig,
        });
        return data;
      },
      enabled: configuracion?.enabled ?? params?.length > 0,
      meta: mergedMeta,
      ...configuracionAdicional,
    })),
  });

  return {
    data: queries.map((q) => q.data),
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    queries,
  };
}

/**
 * Hook genérico para mutaciones (POST, PUT, PATCH, DELETE) usando React Query.
 *
 * @function
 * @param {Object} options - Opciones para la mutación.
 * @param {string} [options.method='POST'] - Método HTTP a utilizar.
 * @param {string} options.url - Endpoint para la mutación.
 * @param {Object} [options.params={}] - Parámetros de consulta para la URL.
 * @param {Object} [options.data={}] - Datos a enviar en el cuerpo de la petición. 
 * @param {string} [options.contentType='application/json'] - Tipo de contenido del header.
 * @param {Array} [options.queriesToInvalidate=[]] - Queries a invalidar/refrescar tras la mutación.
 * @param {string} [options.nombreHook='useGenericMutation'] - Nombre del hook.
 * @param {Function} [options.onSuccess] - Callback a ejecutar en éxito.
 * @param {Function} [options.onError] - Callback a ejecutar en error.
 * @param {boolean} [options.refetch=false] - Si se debe hacer refetch tras invalidar.
 * @param {Function|null} [options.updater=null] - Función para actualizar el cache.
 * @param {Object} [mutationOptions] - Opciones adicionales para useMutation (retry, meta, etc).
 * @returns {import('@tanstack/react-query').UseMutationResult} Objeto resultado de useMutation.
 */
export const useGenericMutation = ({
  method = 'POST',
  url,
  params = {},
  data,
  token = null,
  contentType = 'application/json',
  queriesToInvalidate = [],
  // eslint-disable-next-line no-unused-vars
  nombreHook = 'useGenericMutation',
  onSuccess,
  onError,
  refetch = false,
  updater = null, // Función para actualizar el cache
  configAxios = {},
  ...mutationOptions // retry, meta, etc.
}) => {
  
  const invalidateAndRefetch = useInvalidateAndRefetch();

  // Define para los get un meta por defecto
  // que se puede sobreescribir en configuracion.meta
  const defaultMeta = {
    habilitarExito: false,
    habilitarAdvertencia: true,
    habilitarError: true,
    mensajeError: { tipo: 'flotante', severity: 'error', titulo: "Error al cargar los datos", tiempo: false },
    mensajeExito: { tipo: 'flotante', severity: 'success', titulo: "La operación ha sido exitosa", tiempo: true },
  }
  const { meta, ...otrasConfiguraciones } = mutationOptions;

  // Merge con defaultMeta y configuracion.meta para permitir personalización
  const mergedMeta = {
    ...defaultMeta,
    ...(meta || {}),
  };

   // Unificamos headers
  
  return useMutation({
    mutationFn: async (variables = {}) => {

      const finalParams = {
        ...params,
        ...(variables.params || variables || {}),
      };
      const finalData = variables.data ?? data;

      const resolvedUrl = urlConParametros(url, finalParams);      
      
       // Extraemos configuraciones adicionales
      const {
        headers: customHeaders = {'Content-Type': contentType},
        responseType,
        ...otrosConfig
      } = configAxios;

      // Unificamos headers
      const headers = { 
        ...customHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const queryParams = params && params.queryParams ? params.queryParams : {};
      try {
        let response;
        switch (method.toUpperCase()) {
          case 'POST':
            response = await api.post(resolvedUrl, finalData, { params: queryParams, headers, responseType, ...otrosConfig });
            break;
          case 'PUT':
            response = await api.put(resolvedUrl, finalData, { params: queryParams, headers, responseType, ...otrosConfig });
            break;
          case 'PATCH':
            response = await api.patch(resolvedUrl, finalData, { params: queryParams, headers, responseType, ...otrosConfig });
            break;
          case 'DELETE':
            response = await api.delete(resolvedUrl, { params: queryParams, headers, responseType, ...otrosConfig });
            break;
          default:
            throw new Error(`Método HTTP no soportado: ${method}`);
        }

        return response.data;
      } catch (error) {
        console.error('Error en la mutación:', error);
        throw error;
      }
    },

    meta: mergedMeta,

    onSuccess: async (datos, variables, context) => {

      // llama a invalidateAndRefetch si el arreglo tiene algún elemento
      if (Array.isArray(queriesToInvalidate) && queriesToInvalidate.length > 0) {
        try {
          await invalidateAndRefetch(
                                  queriesToInvalidate, {
                                  shouldRefetch: refetch,
                                  updater,
                                });
        } catch (e) {
          // para el caso de error de invalidación
          console.warn('Error al invalidar keys:', e);
        }
      }

      if (typeof onSuccess === 'function') {
        await onSuccess(datos, variables, context);
      }
    },

    onError,

    ...otrasConfiguraciones,
  });
};


/**
 * Hook para realizar peticiones POST usando useGenericMutation.
 *
 * @function
 * @param {Object} props - Propiedades para la mutación POST.
 * @param {string} props.url - Endpoint para la petición.
 * @param {string} props.nombreHook - Nombre del hook.
 * @param {Object} [props.params={}] - Parámetros de consulta.
 * @param {Function|null} [props.updater=null] - Función para actualizar el cache.
 * @param {boolean} [props.conAuth=true] - Si se debe incluir el token de autenticación.
 * @param {Array} [props.queriesToInvalidate=[]] - Queries a invalidar/refrescar tras la mutación.
 * @param {Object} [props.data] - Datos a enviar en el cuerpo de la petición.
 * @param {Function} [props.onSuccess] - Callback en éxito.
 * @param {Function} [props.onError] - Callback en error.
 * @param {boolean} [props.refetch=false] - Si se debe hacer refetch tras invalidar.
 * @param {Object} [props.meta={}] - Meta personalizada.
 * @param {Object} [rest] - Otras opciones adicionales.
 * @returns {import('@tanstack/react-query').UseMutationResult} Objeto resultado de useMutation.
 */
export const usePost = (props) => {
  const {
    url,
    nombreHook,
    params = {},
    configuracion = {},
  } = props;

  const { updater = null,
          conAuth = true,
          data,
          onSuccess,
          onError,
          refetch = false,
          meta = {}, //customMeta
          ...rest
      } = configuracion

  return useGenericMutation({
    method: 'POST',
    url,
    params,
    data,
    token: null,
    nombreHook,
    onSuccess,
    onError,
    refetch,
    updater,
    meta,
    ...rest,
  });
};

/**
 * Hook para realizar peticiones PUT usando useGenericMutation.
 *
 * @function
 * @param {Object} props - Propiedades para la mutación PUT.
 * @param {string} props.url - Endpoint para la petición.
 * @param {string} props.nombreHook - Nombre del hook.
 * @param {Object} [props.params={}] - Parámetros de consulta.
 * @param {Function|null} [props.updater=null] - Función para actualizar el cache.
 * @param {boolean} [props.conAuth=true] - Si se debe incluir el token de autenticación.
 * @param {Array} [props.queriesToInvalidate=[]] - Queries a invalidar/refrescar tras la mutación.
 * @param {Object} [props.data] - Datos a enviar en el cuerpo de la petición.
 * @param {Function} [props.onSuccess] - Callback en éxito.
 * @param {Function} [props.onError] - Callback en error.
 * @param {boolean} [props.refetch=false] - Si se debe hacer refetch tras invalidar.
 * @param {Object} [rest] - Otras opciones adicionales.
 * @returns {import('@tanstack/react-query').UseMutationResult} Objeto resultado de useMutation.
 */
export const usePut = (props) => {
  const {
    url,
    nombreHook,
    params = {},
    configuracion = {},
  
  } = props; 

  const {  updater = null, 
            queriesToInvalidate = [],
            data,
            onSuccess,
            onError,
            refetch = false,
            meta = {}, //customMeta
            ...rest} = configuracion;


  return useGenericMutation({
    method: 'PUT',
    url,
    params,
    data,
    token: null,
    queriesToInvalidate,
    nombreHook,
    onSuccess,
    onError,
    refetch,
    updater,
    meta,
    ...rest,
  });
};

/**
 * Hook para realizar peticiones DELETE usando useGenericMutation.
 *
 * @function
 * @param {Object} props - Propiedades para la mutación DELETE.
 * @param {string} props.url - Endpoint para la petición.
 * @param {string} props.nombreHook - Nombre del hook.
 * @param {Object} [props.params={}] - Parámetros de consulta.
 * @param {Function|null} [props.updater=null] - Función para actualizar el cache.
 * @param {boolean} [props.conAuth=true] - Si se debe incluir el token de autenticación.
 * @param {Array} [props.queriesToInvalidate=[]] - Queries a invalidar/refrescar tras la mutación.
 * @param {Object} [props.data] - Datos a enviar en el cuerpo de la petición.
 * @param {Function} [props.onSuccess] - Callback en éxito.
 * @param {Function} [props.onError] - Callback en error.
 * @param {boolean} [props.refetch=false] - Si se debe hacer refetch tras invalidar.
 * @param {Object} [rest] - Otras opciones adicionales.
 * @returns {import('@tanstack/react-query').UseMutationResult} Objeto resultado de useMutation.
 */
export const useDelete = (props) => {
  const {
    url,
    nombreHook,
    params = {},
    configuracion ={},
  } = props;

  const {    updater = null,
              conAuth = true,
              queriesToInvalidate = [],
              data,
              onSuccess,
              onError,
              refetch = false,
              meta = {},
              ...rest
          } = configuracion;
  return useGenericMutation({
    method: 'DELETE',
    url,
    params,
    data,
    token: null,
    queriesToInvalidate,
    nombreHook,
    onSuccess,
    onError,
    refetch,
    updater,
    meta,
    ...rest,
  });
};