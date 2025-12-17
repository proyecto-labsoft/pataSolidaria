import { useUsuario } from "../hooks/useUsuario";
import { rutas } from "./api.rutas";
import { useDelete, useGet, usePost, usePut } from "./reactQueryHooks";

// Usuarios
export function useApiGetUsuarioPorId({ id, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetUsuarioPorId",
        url: rutas.usuarioPorId,
        configuracion: { ...opciones }
    });
}

export function useApiPostCrearUsuario({ body, ...opciones }) {
    return usePost({
        nombreHook: "useApiPostCrearUsuario",
        url: rutas.crearUsuario,
        body,
        configuracion: { ...opciones }
    });
}


// Mascotas
export function useApiGetMascotaPorId({ params, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetMascotaPorId",
        url: rutas.mascotaPorId,
        params,
        configuracion: { ...opciones }
    });
}

export function useApiGetMascotasPorUsuario({ parametros, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetMascotasPorUsuario",
        url: rutas.mascotasPorUsuario,
        params: parametros,
        configuracion: { ...opciones }
    });
}

export function useApiPostRegistrarMascota({ params ,...opciones }) {
    return usePost({
        nombreHook: "useApiPostRegistrarMascota",
        url: rutas.registrarMascota,
        configuracion: { ...opciones, queriesToInvalidate: ['useApiGetMascotasPorUsuario', { idUsuario: params?.id }] }
    });
}

export function useApiPutActualizarMascota({ ...opciones }) { 
    return usePut({
        nombreHook: "useApiPutActualizarMascota",
        url: rutas.mascotaPorId, 
        configuracion: { ...opciones, queriesToInvalidate:['useApiGetMascotasPorUsuario', { idUsuario: 2 }] }
    });
}

export function useApiDeleteMascota({ params, ...opciones}) { 
    return useDelete({
        nombreHook: "useApiDeleteMascota",
        url: rutas.mascotaPorId, 
        configuracion: { ...opciones, queriesToInvalidate:['useApiGetMascotasPorUsuario', { idUsuario: params?.id }] }
    });
}

export function useApiGetImagenesMascota({ parametros, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetImagenesMascota",
        url: rutas.imagenesMascota,
        params: parametros,
        configuracion: { 
            ...opciones,
            staleTime: 0, // Siempre considera los datos como obsoletos
            cacheTime: 0, // No mantener en caché
        }
    });
}

// Adopciones
export function useApiGetAdopciones({ ...opciones }) {
    return useGet({
        nombreHook: "useApiGetAdopciones",
        url: rutas.listarAdopciones,
        configuracion: { ...opciones }
    });
}

export function useApiPostCrearAdopcion({ ...opciones }) {
    return usePost({
        nombreHook: "useApiPostCrearAdopcion",
        url: rutas.crearAdopcion,
        configuracion: { ...opciones, queriesToInvalidate: ['useApiGetAdopciones'] }
    });
} 
// Esto lo modifica solo la asociacion TODO
export function useApiPutActualizarAdopcion({ parametros, ...opciones }) {
    return usePut({
        nombreHook: "useApiPutActualizarAdopcion",
        url: rutas.adopcionPorId,
        params: parametros,
        configuracion: { ...opciones }
    });
}

// Extravíos
export function useApiGetExtravios({ params,...opciones }) {
    return useGet({
        nombreHook: "useApiGetExtravios",
        url: rutas.extravios,
        params,
        configuracion: { ...opciones }
    });
}

export function useApiGetExtraviosPorUsuario({ params, ...opciones }) { 
    return useGet({
        nombreHook: "useApiGetExtraviosPorUsuario",
        url: rutas.extraviosPorUsuario,
        params,
        configuracion: { ...opciones }
    });
}

export function useApiGetExtravioPorMascota({ params, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetExtravioPorMascota",
        url: rutas.extraviosPorMascota,
        params,
        configuracion: { ...opciones }
    });
}
export function useApiPostExtravioFamiliar({ ...opciones }) {
    return usePost({
        nombreHook: "useApiPostExtravioFamiliar",
        url: rutas.extravioFamiliar,
        configuracion: { queriesToInvalidate:['useApiGetExtravios'], ...opciones }
    });
}

export function useApiPostExtravioSinFamiliar({ ...opciones }) {
    const { token } = useUsuario() 
    return usePost({
        nombreHook: "useApiPostExtravioSinFamiliar",
        url: rutas.extravioSinFamiliar,
        configuracion: { ...opciones, token: token, queriesToInvalidate:['useApiGetExtravios'] }
    });
}

export function useApiPutActualizarExtravio({ params, ...opciones }) {
    return usePut({
        nombreHook: "useApiPutActualizarExtravio",
        url: rutas.extravioPorId,
        params,
        configuracion: { ...opciones, queriesToInvalidate:['useApiGetExtravios', 'useApiGetExtraviosPorUsuario'] }
    });
}

// Postulaciones
export function useApiGetPostulacionPorId({ ...opciones }) {
    return useGet({
        nombreHook: "useApiGetPostulacionPorId",
        url: rutas.listarPostulaciones,
        configuracion: { ...opciones }
    });
}

export function useApiPostCrearPostulacion({ body, ...opciones }) {
    return usePost({
        nombreHook: "useApiPostCrearPostulacion",
        url: rutas.crearPostulacion,
        body,
        configuracion: { ...opciones }
    });
}

// AVISTAMIENTOS

export function useApiGetAvistamientosPorExtravio({ params, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetAvistamientosPorExtravio",
        url: rutas.avistamientosPorExtravio,
        params,
        configuracion: { ...opciones }
    });
}

export function useApiPostAvistamiento({ ...opciones }) {
    return usePost({
        nombreHook: "useApiPostAvistamiento",
        url: rutas.avistamientos,
        configuracion: { queriesToInvalidate:['useApiGetAvistamientosPorExtravio'], ...opciones }
    });
}

// Favoritos
export function useApiPostFavorito({ ...opciones }) {
    return usePost({
        nombreHook: "useApiPostFavorito",
        url: rutas.extravioFavoritoPorUsuario,
        configuracion: { queriesToInvalidate:['useApiGetFavoritos','useApiGetEsFavorito'], ...opciones }
    });
}

export function useApiDeleteFavorito({ params, ...opciones }) {
    return useDelete({
        nombreHook: "useApiDeleteFavorito",
        url: rutas.eliminarExtravioFavorito,
        params,
        configuracion: { queriesToInvalidate:['useApiGetFavoritos','useApiGetEsFavorito'], ...opciones }
    });
}
export function useApiGetFavoritos({ params, ...opciones }) {
    return useGet({
        nombreHook: "useApiGetFavoritos",
        params,
        url: rutas.extraviosFavoritosPorUsuario,
        configuracion: { ...opciones }
    });
}

export function useApiGetEsFavorito({ params,...opciones }) { 
    return useGet({
        nombreHook: "useApiGetEsFavorito",
        url: rutas.extravioEsFavorito,
        params,
        configuracion: { ...opciones }
    });
}


// Emergencias

export function useApiPostEmergencia({ ...opciones }) {
    const { token } = useUsuario() 
    return usePost({
        nombreHook: "useApiPostEmergencia",
        url: rutas.emergencia,
        configuracion: { ...opciones, token: token, queriesToInvalidate:['useApiGetExtravios'] }
    });
}
// export function useApiGetTransporteLicenciaPorDominio({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteLicenciaPorDominio',
//           url: rutas.licenciaPorDominio,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,  
//             },
//            ...opciones
//         }
//       }
//   ))
// }
// export function useApiGetTransporteLicenciaPorNumero({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteLicenciaPorNumero',
//           url: rutas.licenciaPorNumero,
//           params: parametros,
//           configuracion: {
//               meta: {
//                 habilitarAdvertencia: false,
//                 habilitarExito: false
//               },
//               ...opciones
//           }
          
//       }
//   ))
// }

// export function useApiGetTransporteReporteChoferesPorLicencia({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteReporteChoferes',
//           url: rutas.reporteChoferesPorLicencia,
//           params: parametros,
//           configuracion: {
//             configAxios: {
//               responseType: 'blob'
//             },
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Reporte de choferes generado',
//                 tiempo: true
//               },
//               habilitarExito: true,
//               habilitarAdvertencia: false,
//               habilitarError: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteEstadoConductor({ parametros, tipoBusqueda, ...opciones }) { 
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteEstadoConductor',
//           url: tipoBusqueda === 'documento' ? rutas.estadoConductorPorDocumento : rutas.estadoConductorPorCodigoUsuario,
//           params: tipoBusqueda === 'documento' ? { documento: parametros } : { codusr: parametros },
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// // Transportes Habilitados 
// export function useApiGetTransporteTransportesHabilitados({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteTransportesHabilitados',
//           url: parametros?.codusr ? rutas.transportesHabilitadosPorCodigoUsuario : rutas.transportesHabilitadosPorDocumento,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           },
//       }
//   ))
// }


// export function useApiGetTransporteReporteTransportesHabilitados({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteReporteTransportesHabilitados',
//           url: rutas.reporteTransportesHabilitados,
//           params: parametros,
//           configuracion: {
//             configAxios: {
//               responseType: 'blob'
//             },
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Reporte de transportes habilitados generado',
//                 tiempo: true
//               },
//               habilitarExito: true,
//               habilitarAdvertencia: false,
//               habilitarError: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteHorarioHabilitados({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteHorarioHabilitados',
//           url: rutas.horarioHabilitados,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }



// //GETS a POSTGRESQL
// // Tipos de emplazamiento

// export function useApiGetTransporteTiposEmplazamiento({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteTiposEmplazamiento',
//           url: rutas.tiposEmplazamiento,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteTiposEmplazamientoPorCodigo({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteTiposEmplazamientoPorCodigo',
//           url: rutas.tiposEmplazamientoPorCodigo,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiDeleteRentasTipoEmplazamientoPorCodigo({ parametros, ...opciones }) {
//   return (useDelete(
//     {
//       nombreHook: "useApiDeleteRentasTipoPoderPorCodigo",      
//       url: rutas.tiposEmplazamientoPorCodigo,
//       params: parametros,
//       configuracion: {
//         meta: {
//           habilitarAdvertencia: false,
//           habilitarExito: false,
//         },
//         ...opciones
//       }
//     }))
// }

// export function useApiPutTransporteTipoEmplazamiento({ parametros, ...opciones }) {
//   return (usePut(
//     {
//       nombreHook: "useApiPutTransporteTipoEmplazamiento",      
//       url: rutas.tiposEmplazamientoPorCodigo,
//       params: parametros,
//       configuracion: {
//         meta: {
//           mensajeExito: {
//             tipo: 'exito',
//             titulo: 'Tipo de emplazamiento actualizado correctamente',
//             tiempo: true
//           },
//           habilitarExito: true,
//           habilitarError: true,
//           habilitarAdvertencia: true,
//         },
//         ...opciones
//       }
//     }))
// }

// export function useApiPostTransporteTipoEmplazamientoCrear({ ...opciones }) {
//   return (usePost(
//     {
//       nombreHook: "useApiPostTransporteTipoEmplazamientoCrear",      
//       url: rutas.tiposEmplazamiento,
//       configuracion: {
//         meta: {
//           mensajeExito: {
//             tipo: 'exito',
//             titulo: 'Se creo el tipo de emplazamiento correctamente',
//             tiempo: true
//           },
//           habilitarExito: true,
//           habilitarError: true,
//           habilitarAdvertencia: true,
//         },
//         ...opciones
//       }
//     }))
// }

// // Novedades
// export function useApiGetTransporteExistenNovedadesPorLicencia({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteExistenNovedadesPorLicencia',
//           url: rutas.existenNovedadesPorLicencia,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
          
//       }
//   ))
// }

// export function useApiGetTransporteNovedadesPorLicencia({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteNovedadesPorLicencia',
//           url: rutas.novedadesPorLicencia,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteReporteNovedades({ parametros, opciones = {} }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteReporteNovedades',
//           url: rutas.reporteNovedades,
//           params: parametros,
//           configuracion: { 
//             meta: {
//               habilitarExito: true,
//               habilitarAdvertencia: false,
//               habilitarError: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteNovedadesPorLicenciaCumplidas({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteNovedadesPorLicenciaEsCumplida',
//           url: rutas.novedadesPorLicenciaCumplidas,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteNovedadesPorLicenciaNoCumplidas({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteNovedadesPorLicenciaEsCumplida',
//           url: rutas.novedadesPorLicenciaNoCumplidas,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteReporteEmplazamientos({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteReporteEmplazamientos',
//           url: rutas.reporteEmplazamientos,
//           params: parametros,
//           configuracion: {
//             configAxios: {
//               responseType: 'blob'
//             },
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Reporte de emplazamientos generado',
//                 tiempo: true
//               },
//               habilitarExito: true,
//               habilitarAdvertencia: false,
//               habilitarError: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteReporteFueraServicio({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteReporteFueraServicio',
//           url: rutas.reporteFueraServicio,
//           params: parametros,
//           configuracion: {
//             configAxios: {
//               responseType: 'blob'
//             },
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Reporte de fuera de servicios generado',
//                 tiempo: true
//               },
              
//               habilitarExito: true,
//               habilitarAdvertencia: false,
//               habilitarError: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// // Fuera de servicios
// export function useApiGetTransporteFueraServiciosPorLicencia({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteFueraServiciosPorLicencia',
//           url: rutas.fueraServiciosPorLicencia,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }


// export function useApiGetTransporteFueraServicioPorCodigo({ parametros, opciones = {} }) {
  
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteFueraServicioPorCodigo',
//           url: rutas.fueraServicioPorCodigo,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteFueraServiciosActivos({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteFueraServiciosActivos',
//           url: rutas.fueraServiciosActivos,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteFueraServiciosNoActivos({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteFueraServiciosActivos',
//           url: rutas.fueraServiciosNoActivos,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiPutTransporteFueraServicio({ parametros, opciones = {} }) {
//   return (usePut(
//       {
//           nombreHook: 'useApiPutTransporteFueraServicio',
//           url: rutas.fueraServicioPorCodigo,
//           params: parametros,
//           configuracion: {
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Fuera de servicio actualizado correctamente',
//                 tiempo: true
//               },
//               habilitarAdvertencia: false,
//               habilitarError: false
//             },
//             ...opciones
//           }
          
//       }
//   ))
// }
// export function useApiPostTransporteFueraServicioCrear({ opciones = {} }) {
//   return (usePost(
//       {
//           nombreHook: 'useApiPostTransporteFueraServicioCrear',
//           url: rutas.fueraServicio,
//           configuracion: {
//             mensajeExito: {
//               tipo: 'exito',
//               titulo: 'Se ha creado un nuevo fuera de servico correctamente',
//               tiempo: true
//             },
//             ...opciones
//           }
//       }
//   ))
// }
 


// export function useApiGetTransporteEmplazamientoPorCodigo({ parametros, opciones = {} }) { 
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteEmplazamientoPorCodigo',
//           url: rutas.emplazamientoPorCodigo,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiGetTransporteEmplazamientosActivos({ parametros, ...opciones }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteEmplazamientosActivos',
//           url: rutas.emplazamientosActivos,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiPostTransporteEmplazamientoCrear({ opciones = {} }) {
//   return (usePost(
//       {
//           nombreHook: 'useApiPostTransporteEmplazamientoCrear',
//           url: rutas.emplazamiento,
//           configuracion: {
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Se ha creado la novedad correctamente',
//                 tiempo: true
//               }
//             },
//             ...opciones
//           }
          
//       }
//   ))
// }


// export function useApiPutTransporteEmplazamiento({ parametros, opciones = {}}) {
//   return (usePut(
//       {
//           nombreHook: 'useApiPutTransporteEmplazamiento',
//           url: rutas.emplazamientoPorCodigo,
//           params: parametros,
//           configuracion: { 
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Emplazamiento actualizado correctamente',
//                 tiempo: true
//               },
//               habilitarAdvertencia: false,
//               habilitarError: false,
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// // Controles reloj
// export function useApiGetTransporteControlesRelojPorLicencia({ parametros, opciones = {} }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteControlesRelojPorLicencia',
//           url: rutas.controlesRelojPorLicencia,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false  
//             },
//             ...opciones
//           },
          
          
//       }
//   ))
// }

// export function useApiGetTransporteControlRelojPorCodigo({ parametros, opciones = {} }) {
//   return (useGet(
//       {
//           nombreHook: 'useApiGetTransporteControlRelojPorCodigo',
//           url: rutas.controlRelojPorCodigo,
//           params: parametros,
//           configuracion: {
//             meta: {
//               habilitarAdvertencia: false,
//               habilitarExito: false
//             },
//             ...opciones
//           }
//       }
//   ))
// }

// export function useApiPostTransporteControlRelojCrear({ opciones = {} }) {
//   return (usePost(
//       {
//           nombreHook: 'useApiPostTransporteControlRelojCrear',
//           url: rutas.controlReloj,
//           configuracion: {
//             meta: {
//               mensajeExito: {
//                 tipo: 'exito',
//                 titulo: 'Se ha creado el control diario con éxito',
//                 tiempo: true
//               }
//             },
//             ...opciones
//           }
          
//       }
//   ))
// }
