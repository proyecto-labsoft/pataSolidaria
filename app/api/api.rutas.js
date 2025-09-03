/**
 * Rutas para el módulo de AUTORIZACION.
 *
 * Contiene todos los endpoints para la gestión de módulos, procesos, roles,
 * tareas, trámites y usuarios.
 *
 * @constant
 * @type {Object}
 */
const URL_API = "https://localhost:8083"

export const rutas = {
  extravios: `${URL_API}/extravios`,
  mascotaPorId: `${URL_API}/mascotas/{id}`,
  // licenciaPorNumero: `${URL_API}/licencias/{tipo}/{licencia}`,
  // reporteChoferesPorLicencia: `${URL_API}/choferes/reporte?tipo={tipo}&licencia={licencia}`,
  // estadoConductorPorCodigoUsuario: `${URL_API}/choferes/codusr/{codusr}`,
  // estadoConductorPorDocumento: `${URL_API}/choferes/documento/{documento}`,
  // transportesHabilitadosPorDocumento: `${URL_API}/choferes/vehiculos?documento={documento}`,
  // transportesHabilitadosPorCodigoUsuario: `${URL_API}/choferes/vehiculos?codUsuario={codUsuario}`,
  // reporteTransportesHabilitados: `${URL_API}/transportes/reporte?documento={documento}`,
  // horarioHabilitados: `${URL_API}/horarios/{nroLicencia}`,
  // tiposEmplazamiento: `${URL_API}/tipo-emplazamientos`, // Get, Post
  // tiposEmplazamientoPorCodigo: `${URL_API}/tipo-emplazamientos/{id}`,  // Get, Put, Delete
  // existenNovedadesPorLicencia: `${URL_API}/novedades/verificar/{tipo}/{agencia}/{nroLicencia}`, 
  // novedadesPorLicencia: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}`,
  // novedadesPorLicenciaCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=true`,
  // novedadesPorLicenciaNoCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=false`,
  // reporteNovedades: `${URL_API}/novedades/reporte`, // Query Params: desde={desde}, hasta={hasta} , tipo=${tipo} y licencia=${licencia}
  // reporteEmplazamientos: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=E`, // Query Params: tipo=${tipo} y licencia=${licencia}
  // reporteFueraServicio: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=F`, // Query Params: tipo=${tipo} y licencia=${licencia}
  // fueraServiciosPorLicencia: `${URL_API}/fuera-servicios/{tipo}/{agencia}/{licencia}`,
  // fueraServicio: `${URL_API}/fuera-servicios`, // POST
  // fueraServicioPorCodigo: `${URL_API}/fuera-servicios/{id}`,
  // fueraServiciosActivos: `${URL_API}/fuera-servicios/{tipo}/{agencia}/{licencia}?cumplido=false`,
  // fueraServiciosNoActivos: `${URL_API}/fuera-servicios/{tipo}/{agencia}/{licencia}?cumplido=true`, 
  // emplazamiento: `${URL_API}/emplazamientos`, // POST
  // emplazamientoPorCodigo: `${URL_API}/emplazamientos/{id}`,
  // emplazamientosActivos: `${URL_API}/emplazamientos/{tipo}/{agencia}/{licencia}?activo=true`,
  // controlesRelojPorLicencia: `${URL_API}/controles-reloj/{tipo}/{nroLicencia}`,
  // controlRelojPorCodigo: `${URL_API}/controles-reloj/{id}`,
  // controlReloj: `${URL_API}/controles-reloj/`,
  // reporteControlesReloj: `${URL_API}/controles-reloj/reporte`, // Query Params: desde={desde}, hasta={hasta} , tipo=${tipo} y licencia=${licencia}
  // controlesDiariosPorLicencia: `${URL_API}/controles-diarios/{tipo}/{agencia}/{nroLicencia}`,
  // controlDiarioPorCodigo: `${URL_API}/controles-diarios/{id}`,
  // controlDiario: `${URL_API}/controles-diarios`,
  // reporteControlesDiarios: `${URL_API}/controles-diarios/reporte`, // Query Params: desde={desde} hasta={hasta} tipo=${tipo} y licencia=${licencia}`,
  // controlesMensualesPorLicencia: `${URL_API}/desinfecciones/{tipo}/{agencia}/{nroLicencia}`,
  // controlMensualPorCodigo: `${URL_API}/desinfecciones/{id}`,
  // controlMensual: `${URL_API}/desinfecciones`, // POST
  // reporteControlesMensuales: `${URL_API}/desinfecciones/reporte`, // Query Params: desde={desde}, hasta={hasta} , tipo=${tipo} y licencia=${licencia}
  // imagenesEmplazamiento: `${URL_API}/imagenes/{codigo}/1`, // Post y Get
  // imagenesEmplazamientosTodos: `${URL_API}/imagenes/1`, 
  // imagenEmplazamientoBorrar: `${URL_API}/imagenes/{codigo}/1/{idImagen}`,
  // observacionesDominio: `${URL_API}/observacion-dominio`,
  // observacionesDominioPorDominio: `${URL_API}/observacion-dominio/dom/{dominio}`,
  // observacionDominioPorId: `${URL_API}/observacion-dominio/{id}`, // Get, Put 
  // controlesOculares: `${URL_API}/control-ocular`, // Post, Get all
  // controlesOcularesPorLicencia: `${URL_API}/control-ocular/{tipo}/{nroLicencia}`,
  // controlOcularPorId: `${URL_API}/control-ocular/{id}`, // Get, Put, Delete
  // itemsControlOcularPorTipo: `${URL_API}/item/tipo/{tipoId}`, // Get 
  // imagenesControlOcular: `${URL_API}/imagenes/{codigo}/6`, // Post y Get
  // imagenesControlesOcularesTodos: `${URL_API}/imagenes/6`, 
  // imagenControlOcularBorrar: `${URL_API}/imagenes/{codigo}/6/{idImagen}`,
}   