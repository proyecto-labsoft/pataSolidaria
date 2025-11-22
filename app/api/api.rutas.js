/**
 * Rutas para el módulo de AUTORIZACION.
 *
 * Contiene todos los endpoints para la gestión de módulos, procesos, roles,
 * tareas, trámites y usuarios.
 *
 * @constant
 * @type {Object}
 */
// const URL_API = "http://172.24.96.1:8083" // WSL/Docker IP
// const URL_API = "http://localhost:8083" // Funciona con WiFi y Ethernet
//const URL_API = "http://192.168.49.93:8083" // Muni
// const URL_API = "http://192.168.0.44:8083" 
// const URL_API = "http://192.168.1.127:8083"
// const URL_API = "http://192.168.1.14:8083"  // eze
 const URL_API = "192.168.49.54"; // muni eze

export const rutas = {
  extravios: `${URL_API}/extravios`, // Query Params: resueltos=${resueltos}
  extravioFamiliar: `${URL_API}/extravios`,
  extravioSinFamiliar: `${URL_API}/extravios/sin-familiar`,
  extraviosPorUsuario: `${URL_API}/extravios/user/{id}`, // GET
  extraviosPorMascota: `${URL_API}/extravios/mascota/{id}`, // GET
  
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