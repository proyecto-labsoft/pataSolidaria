/**
 * Rutas para el módulo de AUTORIZACION.
 *
 * Contiene todos los endpoints para la gestión de módulos, procesos, roles,
 * tareas, trámites y usuarios.
 *
 * @constant
 * @type {Object}
 */
// const URL_API = "http://172.24.96.1:8083"
const URL_API = "http://192.168.49.65:8083" // Muni

export const rutas = {
  extravios: `${URL_API}/extravios`, // Query Params: resueltos=${resueltos}
  registrarExtravio: `${URL_API}/extravios`,
  
  mascotaPorId: `${URL_API}/mascotas/{id}`, // GET, PUT, DELETE
  registrarMascota: `${URL_API}/mascotas`, // POST
  mascotasPorUsuario: `${URL_API}/mascotas/user/{idUsuario}`, // GET

  crearUsuario: `${URL_API}/usuarios`, // POST 
  usuarioPorId: `${URL_API}/usuarios/{id}`, // GET, PUT, DELETE

  listarAdopciones: `${URL_API}/adopciones`,
  crearAdopcion: `${URL_API}/adopciones`,

  listarPostulaciones: `${URL_API}/postulaciones`,
  crearPostulacion: `${URL_API}/postulaciones`,
  
  // novedadesPorLicenciaCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=true`,
  // novedadesPorLicenciaNoCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=false`,
  // reporteNovedades: `${URL_API}/novedades/reporte`, // Query Params: desde={desde}, hasta={hasta} , tipo=${tipo} y licencia=${licencia}
  // reporteEmplazamientos: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=E`, // Query Params: tipo=${tipo} y licencia=${licencia}
  // reporteFueraServicio: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=F`, // Query Params: tipo=${tipo} y licencia=${licencia}
  
}   