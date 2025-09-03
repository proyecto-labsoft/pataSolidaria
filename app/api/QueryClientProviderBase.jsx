import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types'; 
// import { useMensajesContextDelta } from 'base/mensajes';
import {
  QueryClient,
  QueryCache,
  MutationCache,
  QueryClientProvider
} from '@tanstack/react-query';

/**
 * Componente proveedor de React Query que configura el `QueryClient`
 * con manejo global de mensajes (éxito, error) personalizados,
 * usando el contexto de mensajes de Ventanilla.
 *
 * Este componente debe envolver la aplicación para habilitar `react-query`.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que estarán dentro del contexto de React Query.
 *
 * @returns {React.ReactElement}
 *
 * @example
 * <QueryClientProviderBase>
 *   <App />
 * </QueryClientProviderBase>
 */
export default function QueryClientProviderBase({ children }) {
  
  //
//   const configMensajesDefault = useCallback(() => ({
//   flotante: {
//     success: {
//       severity: 'success',
//       tipo: 'flotante',
//       autoClose: true,
//       mensaje: 'Operación realizada con éxito.',
//     },
//     error: {
//       severity: 'error',
//       tipo: 'flotante',
//       autoClose: false,
//       mensaje: 'Error inesperado.',
//     },
//   },
//   dialog: {
//     success: {
//       severity: 'success',
//       tipo: 'dialog',
//       mensaje: 'La operación se completó correctamente.',
//     },
//     error: {
//       severity: 'error',
//       tipo: 'dialog',
//       mensaje: 'Ocurrió un error. Por favor intentá nuevamente.',
//     },
//   },
// }), []);

  
  // Obtiene la función `agregarMensaje` desde el contexto de mensajes personalizados de Ventanilla.

  // const agregarMensaje = useMensajesContextDelta();

  // Crea una única instancia de QueryClient al montar el componente.
  // const queryClient = useMemo(
  //   () => crearQueryClient(agregarMensaje, {}, configMensajesDefault),
  //   [agregarMensaje, configMensajesDefault]
  // );

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      // onError: (err, query) => error(err, query?.meta ?? {}),
      // onSuccess: (data, query) => exito(data, query?.meta ?? {}),
    }),
    mutationCache: new MutationCache({
      // onError: (err, _vars, _ctx, mutation) =>{console.log(err,_vars,_ctx, mutation); error(err, mutation?.meta ?? {})},
      // onSuccess: (data, _vars, _ctx, mutation) => exito(data, mutation?.meta ?? {}),
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }, 
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

QueryClientProviderBase.propTypes = {
  /** Elementos React que estarán dentro del contexto de React Query */
  children: PropTypes.node.isRequired,
};
